export const RECAP_QUESTIONS = [
  {
    id: 1,
    q: "In a right-angled triangle, which side is the hypotenuse?",
    options: [
      "The longest side, opposite the right angle",
      "The shortest side",
      "Any side that touches the right angle",
      "The side at the bottom"
    ],
    correct: "The longest side, opposite the right angle",
    explanation: "The hypotenuse is always the longest side of a right-angled triangle, directly opposite the 90° right angle."
  },
  {
    id: 2,
    q: "A 10 m ladder reaches 8 m up a wall. To find how far its foot is from the wall, Jun Kai calculates √(10² + 8²). What is wrong?",
    options: [
      "He should subtract: √(10² − 8²) = 6 m, because the ladder is the hypotenuse",
      "He should multiply the two numbers",
      "He should add the lengths: 10 + 8",
      "Nothing is wrong"
    ],
    correct: "He should subtract: √(10² − 8²) = 6 m, because the ladder is the hypotenuse",
    explanation: "When finding a leg (a shorter side), you must subtract the known leg's square from the hypotenuse's square: 100 − 64 = 36, so √36 = 6 m."
  },
  {
    id: 3,
    q: "A corner has marks 9 cm and 12 cm along its edges, and 16 cm between the marks. Is it a right angle?",
    options: [
      "No, because 9² + 12² = 225, which is not equal to 16² = 256",
      "Yes, because 9 + 12 > 16",
      "Yes, because 9² + 12² = 16²",
      "No, because 16 is not a multiple of 9"
    ],
    correct: "No, because 9² + 12² = 225, which is not equal to 16² = 256",
    explanation: "By the converse of Pythagoras' theorem, a corner is square only if a² + b² = c². Here, 81 + 144 = 225, which does not equal 256, so it is not a right angle."
  }
];
