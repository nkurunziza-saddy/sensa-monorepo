export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface DetectionMetadata {
  isCentered: boolean;
  distance: "near" | "far" | "ideal";
  handFound: boolean;
}

export function detectGesture(landmarks: HandLandmark[]): {
  gesture: string | null;
  metadata: DetectionMetadata;
} {
  const metadata: DetectionMetadata = {
    isCentered: false,
    distance: "ideal",
    handFound: !!(landmarks && landmarks.length >= 21),
  };

  if (!metadata.handFound) return { gesture: null, metadata };

  // 1. Calculate Center and Distance
  const wrist = landmarks[0];
  metadata.isCentered = wrist.x > 0.3 && wrist.x < 0.7 && wrist.y > 0.3 && wrist.y < 0.8;

  // Depth heuristic based on distance between wrist and middle finger base
  const handSize = Math.sqrt(
    Math.pow(landmarks[0].x - landmarks[9].x, 2) + Math.pow(landmarks[0].y - landmarks[9].y, 2),
  );

  if (handSize < 0.15) metadata.distance = "far";
  else if (handSize > 0.45) metadata.distance = "near";
  else metadata.distance = "ideal";

  // 2. Gesture Heuristics (Enhanced)
  const isFingerUp = (tipIdx: number, dipIdx: number, pipIdx: number) => {
    // Tip must be above DIP and PIP for it to be clearly "up"
    return landmarks[tipIdx].y < landmarks[dipIdx].y && landmarks[tipIdx].y < landmarks[pipIdx].y;
  };

  const thumbUp = landmarks[4].y < landmarks[3].y && landmarks[4].y < landmarks[2].y;
  const indexUp = isFingerUp(8, 7, 6);
  const middleUp = isFingerUp(12, 11, 10);
  const ringUp = isFingerUp(16, 15, 14);
  const pinkyUp = isFingerUp(20, 19, 18);

  let gesture: string | null = null;

  // Thumbs Up
  if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
    if (landmarks[4].y < landmarks[1].y) gesture = "thumbs_up";
  }
  // Open Palm
  else if (indexUp && middleUp && ringUp && pinkyUp) {
    gesture = "open_palm";
  }
  // Fist
  else if (!indexUp && !middleUp && !ringUp && !pinkyUp && !thumbUp) {
    gesture = "fist";
  }
  // Peace Sign
  else if (indexUp && middleUp && !ringUp && !pinkyUp) {
    gesture = "peace_sign";
  }
  // Pointing Up
  else if (indexUp && !middleUp && !ringUp && pinkyUp === false) {
    gesture = "pointing_up";
  }
  // OK Sign (Touch thumb and index)
  else {
    const distThumbIndex = Math.sqrt(
      Math.pow(landmarks[4].x - landmarks[8].x, 2) + Math.pow(landmarks[4].y - landmarks[8].y, 2),
    );
    if (distThumbIndex < 0.04 && middleUp && ringUp && pinkyUp) {
      gesture = "ok";
    }
    // Love You (Thumb, Index, Pinky)
    else if (thumbUp && indexUp && !middleUp && !ringUp && pinkyUp) {
      gesture = "love_you";
    }
  }

  return { gesture, metadata };
}
