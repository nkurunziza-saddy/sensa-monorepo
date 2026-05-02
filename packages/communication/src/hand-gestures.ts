export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface DetectionMetadata {
  isCentered: boolean;
  distance: "near" | "far" | "ideal";
  handFound: boolean;
  orientation: "upright" | "sideways" | "inverted";
  confidence: number;
}

/**
 * Calculates the Euclidean distance between two points.
 */
function getDist(p1: HandLandmark, p2: HandLandmark) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Calculates the angle (0-180) between three points.
 */
function getAngle(a: HandLandmark, b: HandLandmark, c: HandLandmark): number {
  const v1 = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  const v2 = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x**2 + v1.y**2 + v1.z**2);
  const mag2 = Math.sqrt(v2.x**2 + v2.y**2 + v2.z**2);
  return Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * (180 / Math.PI);
}

export function detectGesture(landmarks: HandLandmark[]): { gesture: string | null; metadata: DetectionMetadata } {
  const metadata: DetectionMetadata = {
    isCentered: false,
    distance: "ideal",
    handFound: !!(landmarks && landmarks.length >= 21),
    orientation: "upright",
    confidence: 0
  };

  if (!metadata.handFound) return { gesture: null, metadata };

  // 1. Normalize and Analyze Palm Orientation
  const wrist = landmarks[0];
  const middleBase = landmarks[9];
  const indexBase = landmarks[5];
  const pinkyBase = landmarks[17];
  const palmWidth = getDist(indexBase, pinkyBase);
  const palmHeight = getDist(wrist, middleBase);
  const handScale = Math.max((palmWidth + palmHeight) / 2, 0.001);

  // Center & Distance
  metadata.isCentered = wrist.x > 0.2 && wrist.x < 0.8 && wrist.y > 0.15 && wrist.y < 0.85;
  if (handScale < 0.11) metadata.distance = "far";
  else if (handScale > 0.28) metadata.distance = "near";
  
  // Orientation (Vector from wrist to middle base)
  const dy = wrist.y - middleBase.y;
  const dx = wrist.x - middleBase.x;
  if (Math.abs(dx) > Math.abs(dy)) metadata.orientation = "sideways";
  else if (dy < 0) metadata.orientation = "inverted";

  // 2. Advanced Finger State Logic
  // A finger is "Extended" if its joint angle is near 180 degrees AND its tip is far from the palm
  const checkFinger = (mcp: number, pip: number, tip: number) => {
    const angle = getAngle(landmarks[mcp], landmarks[pip], landmarks[tip]);
    const tipToWrist = getDist(landmarks[tip], wrist);
    const pipToWrist = getDist(landmarks[pip], wrist);
    const tipToMcp = getDist(landmarks[tip], landmarks[mcp]);
    const pipToMcp = getDist(landmarks[pip], landmarks[mcp]);
    const isLongEnough = tipToWrist > pipToWrist + handScale * 0.2;
    const isOpen = angle > 155 && tipToMcp > pipToMcp * 1.15;
    return isOpen && isLongEnough;
  };

  const indexOut = checkFinger(5, 6, 8);
  const middleOut = checkFinger(9, 10, 12);
  const ringOut = checkFinger(13, 14, 16);
  const pinkyOut = checkFinger(17, 18, 20);

  // Thumb is special (angle between thumb tip, thumb base, and index base)
  const thumbAngle = getAngle(landmarks[4], landmarks[2], landmarks[5]);
  const thumbToPalm = getDist(landmarks[4], indexBase);
  const thumbKnuckleToPalm = getDist(landmarks[2], indexBase);
  const thumbOut = thumbAngle > 30 && thumbToPalm > thumbKnuckleToPalm + handScale * 0.18;

  const indexMiddleGap = getDist(landmarks[8], landmarks[12]) / handScale;
  const thumbIndexGap = getDist(landmarks[4], landmarks[8]) / handScale;
  const thumbTipAboveWrist = landmarks[4].y < wrist.y - handScale * 0.15;
  const thumbTipBelowWrist = landmarks[4].y > wrist.y + handScale * 0.1;
  const thumbDominant = Math.abs(landmarks[4].x - landmarks[2].x) > handScale * 0.35;

  let gesture: string | null = null;
  let conf = 0;

  // 3. GESTURE PROTOTYPE MATCHING
  
  // Peace Sign (Index & Middle)
  if (indexOut && middleOut && !ringOut && !pinkyOut && indexMiddleGap > 0.24) {
    gesture = "peace_sign";
    conf = 0.9;
  }
  // Thumbs Up (Requires orientation check)
  else if (thumbOut && !indexOut && !middleOut && !ringOut && !pinkyOut && thumbDominant) {
    if (metadata.orientation !== "inverted" && thumbTipAboveWrist) {
       gesture = "thumbs_up";
       conf = 0.88;
    } else if (thumbTipBelowWrist) {
       gesture = "thumbs_down";
       conf = 0.88;
    }
  }
  // Open Palm / Hello
  else if (thumbOut && indexOut && middleOut && ringOut && pinkyOut) {
    gesture = "open_palm";
    conf = 0.95;
  }
  // Fist / Stop
  else if (!indexOut && !middleOut && !ringOut && !pinkyOut && !thumbOut) {
    gesture = "fist";
    conf = 0.9;
  }
  // Pointing Up
  else if (indexOut && !middleOut && !ringOut && !pinkyOut && !thumbOut) {
    gesture = "pointing_up";
    conf = 0.86;
  }
  // Love You (🤟)
  else if (thumbOut && indexOut && !middleOut && !ringOut && pinkyOut) {
    gesture = "love_you";
    conf = 0.9;
  }
  // OK Sign (Distance between thumb tip and index tip)
  else {
    if (thumbIndexGap < 0.42 && middleOut && ringOut && pinkyOut) {
      gesture = "ok";
      conf = 0.88;
    }
  }

  const centeringScore = metadata.isCentered ? 1 : 0.7;
  const distanceScore = metadata.distance === "ideal" ? 1 : 0.82;
  metadata.confidence = clamp(conf * centeringScore * distanceScore, 0, 1);
  return { gesture, metadata };
}

export function drawHand(ctx: CanvasRenderingContext2D, landmarks: HandLandmark[]) {
  const outline = [0, 1, 2, 3, 4, 8, 12, 16, 20, 19, 18, 17];
  const wrist = landmarks[0];
  const isCentered = wrist.x > 0.3 && wrist.x < 0.7 && wrist.y > 0.2 && wrist.y < 0.8;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowBlur = isCentered ? 14 : 8;
  ctx.shadowColor = "rgba(255, 77, 139, 0.45)";
  ctx.strokeStyle = isCentered ? "#ff4d8b" : "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = isCentered ? 3 : 2;

  ctx.beginPath();
  outline.forEach((pointIndex, index) => {
    const point = landmarks[pointIndex];
    const x = point.x * ctx.canvas.width;
    const y = point.y * ctx.canvas.height;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
