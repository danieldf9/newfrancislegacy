export interface CodingChallenge {
  slug: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Arrays' | 'Strings' | 'Trees' | 'Graphs';
  starterCode: string;
  testCases: Array<{
    input: any;
    expected: any;
  }>;
}

export const challenges: CodingChallenge[] = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    difficulty: 'Easy',
    category: 'Arrays',
    starterCode: 
`/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
};`,
    testCases: [
        { input: [[2,7,11,15], 9], expected: [0,1] },
        { input: [[3,2,4], 6], expected: [1,2] },
    ]
  },
  {
    slug: 'reverse-string',
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.',
    difficulty: 'Easy',
    category: 'Strings',
    starterCode: 
`/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
    // Write your code here
};`,
     testCases: [
        { input: [['h','e','l','l','o']], expected: ['o','l','l','e','h'] },
        { input: [['H','a','n','n','a','h']], expected: ['h','a','n','n','a','H'] },
    ]
  },
    {
    slug: 'palindrome-number',
    title: 'Palindrome Number',
    description: 'Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.',
    difficulty: 'Easy',
    category: 'Arrays',
    starterCode:
`/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    // Write your code here
};`,
    testCases: [
        { input: [121], expected: true },
        { input: [-121], expected: false },
        { input: [10], expected: false },
    ]
  },
];
