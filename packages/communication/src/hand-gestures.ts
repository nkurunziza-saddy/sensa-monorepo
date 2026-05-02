export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface DetectionMetadata {
  isCentered: boolean;
  distance: "near" | "far" | "ideal";
  handFound: boolean;
  score: number;
}

/**
 * Calculates the angle between three points (A, B, C) where B is the vertex.
 */
function getAngle(a: HandLandmark, b: HandLandmark, c: HandLandmark): number {
  const v1 = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  const v2 = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };

  const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

  return Math.acos(dotProduct / (mag1 * mag2)) * (180 / Math.PI);
}

export function detectGesture(landmarks: HandLandmark[]): {
  gesture: string | null;
  metadata: DetectionMetadata;
} {
  const metadata: DetectionMetadata = {
    isCentered: false,
    distance: "ideal",
    handFound: !!(landmarks && landmarks.length >= 21),
    score: 0,
  };

  if (!metadata.handFound) return { gesture: null, metadata };

  // 1. Precise Position Analysis
  const wrist = landmarks[0];
  const palmBase = landmarks[9]; // Middle finger MCP
  metadata.isCentered = wrist.x > 0.25 && wrist.x < 0.75 && wrist.y > 0.2 && wrist.y < 0.8;

  const handSize = Math.sqrt(Math.pow(wrist.x - palmBase.x, 2) + Math.pow(wrist.y - palmBase.y, 2));
  if (handSize < 0.12) metadata.distance = "far";
  else if (handSize > 0.35) metadata.distance = "near";
  else metadata.distance = "ideal";

  // 2. Finger Extension Detection (Angle-Based)
  // We check if the angle at the PIP joint is close to 180 degrees
  const isExtended = (base: number, pip: number, tip: number) => {
    const angle = getAngle(landmarks[base], landmarks[pip], landmarks[tip]);
    return angle > 150; // High angle means finger is straight
  };

  const indexExtended = isExtended(5, 6, 8);
  const middleExtended = isExtended(9, 10, 12);
  const ringExtended = isExtended(13, 14, 16);
  const pinkyExtended = isExtended(17, 18, 20);

  // Thumb is special (check distance from index base)
  const thumbDistance = Math.sqrt(
    Math.pow(landmarks[4].x - landmarks[5].x, 2) + Math.pow(landmarks[4].y - landmarks[5].y, 2),
  );
  const thumbExtended = thumbDistance > 0.08;

  let gesture: string | null = null;

  // GESTURE LOGIC (PRIORITY ORDER)

  // Open Palm / Hello
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
    gesture = "open_palm";
  }
  // Peace Sign
  else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    gesture = "peace_sign";
  }
  // Thumbs Up
  else if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    // Verify thumb is pointing UP
    if (landmarks[4].y < landmarks[3].y) gesture = "thumbs_up";
  }
  // Pointing Up
  else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    gesture = "pointing_up";
  }
  // Fist / Stop
  else if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    gesture = "fist";
  }
  // Love You (🤟)
  else if (thumbExtended && indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    gesture = "love_you";
  }
  // OK Sign
  else {
    const thumbIndexDist = Math.sqrt(
      Math.pow(landmarks[4].x - landmarks[8].x, 2) + Math.pow(landmarks[4].y - landmarks[8].y, 2),
    );
    if (thumbIndexDist < 0.035 && middleExtended && ringExtended && pinkyExtended) {
      gesture = "ok";
    }
  }

  return { gesture, metadata };
}

/**
 * Utility to draw hand skeleton on canvas for user feedback
 */
export function drawHand(ctx: CanvasRenderingContext2D, landmarks: HandLandmark[]) {
  const connections = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4], // Thumb
    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8], // Index
    [0, 9],
    [9, 10],
    [10, 11],
    [11, 12], // Middle
    [0, 13],
    [13, 14],
    [14, 15],
    [15, 16], // Ring
    [0, 17],
    [17, 18],
    [18, 19],
    [19, 20], // Pinky
    [5, 9],
    [9, 13],
    [13, 17],
    [0, 17], // Palm
  ];

  ctx.save();
  ctx.strokeStyle = "#6366f1"; // Indigo 500
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  // Draw connections
  for (const [start, end] of connections) {
    const p1 = landmarks[start];
    const p2 = landmarks[end];
    ctx.beginPath();
    ctx.moveTo(p1.x * ctx.canvas.width, p1.y * ctx.canvas.height);
    ctx.lineTo(p2.x * ctx.canvas.width, p2.y * ctx.canvas.height);
    ctx.stroke();
  }

  // Draw points
  ctx.fillStyle = "#ffffff";
  for (const landmark of landmarks) {
    ctx.beginPath();
    ctx.arc(landmark.x * ctx.canvas.width, landmark.y * ctx.canvas.height, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}
