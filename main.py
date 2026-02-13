from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
from fastapi.staticfiles import StaticFiles
import random
import google.generativeai as genai
from fastapi.responses import FileResponse

easy_challenges = [
    # 🟢 EASY
    {
        "id": 1,
        "difficulty": "easy",
        "title": "Reverse a String",
        "description": "Write a function that takes a string and returns it reversed.",
        "input_example": "'hello'",
        "output_example": "'olleh'"
    },
    {
        "id": 2,
        "difficulty": "easy",
        "title": "Sum of List",
        "description": "Return the sum of all numbers in a list.",
        "input_example": "[1, 2, 3]",
        "output_example": "6"
    },
    {
        "id": 3,
        "difficulty": "easy",
        "title": "Maximum of Two",
        "description": "Return the larger of two numbers.",
        "input_example": "5, 8",
        "output_example": "8"
    },
    {
        "id": 4,
        "difficulty": "easy",
        "title": "Palindrome Check",
        "description": "Return True if a string reads the same backward as forward.",
        "input_example": "'madam'",
        "output_example": "True"
    },
    {
        "id": 5,
        "difficulty": "easy",
        "title": "Count Vowels",
        "description": "Count how many vowels are in a string.",
        "input_example": "'apple'",
        "output_example": "2"
    },
    {
        "id": 6,
        "difficulty": "easy",
        "title": "Even or Odd",
        "description": "Return 'Even' if a number is even, otherwise 'Odd'.",
        "input_example": "7",
        "output_example": "'Odd'"
    },
    {
        "id": 7,
        "difficulty": "easy",
        "title": "Factorial",
        "description": "Return the factorial of a given number.",
        "input_example": "5",
        "output_example": "120"
    },
    {
        "id": 8,
        "difficulty": "easy",
        "title": "Celsius to Fahrenheit",
        "description": "Convert a temperature in Celsius to Fahrenheit.",
        "input_example": "0",
        "output_example": "32.0"
    },
    {
        "id": 9,
        "difficulty": "easy",
        "title": "Find Min and Max",
        "description": "Return both the smallest and largest numbers in a list.",
        "input_example": "[4, 1, 9, 2]",
        "output_example": "(1, 9)"
    },
    {
        "id": 10,
        "difficulty": "easy",
        "title": "Square Numbers",
        "description": "Return a list of squares for numbers from 1 through n.",
        "input_example": "5",
        "output_example": "[1, 4, 9, 16, 25]"
    },]

medium_challenges=[
    {
        "id": 11,
        "difficulty": "medium",
        "title": "Fibonacci Sequence",
        "description": "Return the first n Fibonacci numbers.",
        "input_example": "6",
        "output_example": "[0, 1, 1, 2, 3, 5]"
    },
    {
        "id": 12,
        "difficulty": "medium",
        "title": "Remove Duplicates",
        "description": "Remove duplicate values from a list.",
        "input_example": "[1, 2, 2, 3, 3]",
        "output_example": "[1, 2, 3]"
    },
    {
        "id": 13,
        "difficulty": "medium",
        "title": "Word Frequency",
        "description": "Return a dictionary counting the occurrences of each word in a string.",
        "input_example": "'hello world hello'",
        "output_example": "{'hello': 2, 'world': 1}"
    },
    {
        "id": 14,
        "difficulty": "medium",
        "title": "Anagram Check",
        "description": "Return True if two strings are anagrams of each other.",
        "input_example": "'listen', 'silent'",
        "output_example": "True"
    },
    {
        "id": 15,
        "difficulty": "medium",
        "title": "Second Largest",
        "description": "Find the second largest number in a list.",
        "input_example": "[1, 4, 7, 3, 7]",
        "output_example": "4"
    },
    {
        "id": 16,
        "difficulty": "medium",
        "title": "Prime Check",
        "description": "Return True if a number is prime.",
        "input_example": "11",
        "output_example": "True"
    },
    {
        "id": 17,
        "difficulty": "medium",
        "title": "List Rotation",
        "description": "Rotate a list by k positions.",
        "input_example": "[1, 2, 3, 4, 5], k=2",
        "output_example": "[4, 5, 1, 2, 3]"
    },
    {
        "id": 18,
        "difficulty": "medium",
        "title": "Merge Dictionaries",
        "description": "Merge two dictionaries into one.",
        "input_example": "{'a': 1}, {'b': 2}",
        "output_example": "{'a': 1, 'b': 2}"
    },
    {
        "id": 19,
        "difficulty": "medium",
        "title": "Find Missing Number",
        "description": "Given numbers from 1–n with one missing, find the missing one.",
        "input_example": "[1, 2, 4, 5]",
        "output_example": "3"
    },
    {
        "id": 20,
        "difficulty": "medium",
        "title": "Flatten List",
        "description": "Flatten a nested list (e.g. [1, [2, [3]]] → [1, 2, 3]).",
        "input_example": "[1, [2, [3]]]",
        "output_example": "[1, 2, 3]"
    },]

hard_challenges=[
    {
        "id": 21,
        "difficulty": "hard",
        "title": "Sudoku Validator",
        "description": "Check if a given Sudoku board is valid according to Sudoku rules.",
        "input_example": "9x9 grid as a list of lists",
        "output_example": "True"
    },
    {
        "id": 22,
        "difficulty": "hard",
        "title": "Longest Palindromic Substring",
        "description": "Return the longest palindrome substring from a given string.",
        "input_example": "'babad'",
        "output_example": "'bab'"
    },
    {
        "id": 23,
        "difficulty": "hard",
        "title": "Matrix Transpose",
        "description": "Transpose a 2D list (matrix).",
        "input_example": "[[1,2,3],[4,5,6]]",
        "output_example": "[[1,4],[2,5],[3,6]]"
    },
    {
        "id": 24,
        "difficulty": "hard",
        "title": "Binary Search",
        "description": "Implement binary search to find a target in a sorted list.",
        "input_example": "[1,3,5,7,9], target=5",
        "output_example": "2"
    },
    {
        "id": 25,
        "difficulty": "hard",
        "title": "LRU Cache",
        "description": "Implement a simple least-recently-used cache class.",
        "input_example": "Put and get operations",
        "output_example": "Correct cache behavior"
    },
    {
        "id": 26,
        "difficulty": "hard",
        "title": "Valid Parentheses",
        "description": "Return True if parentheses are balanced in a string.",
        "input_example": "'(())()'",
        "output_example": "True"
    },
    {
        "id": 27,
        "difficulty": "hard",
        "title": "Word Ladder Step",
        "description": "Find all words one letter apart from a given word.",
        "input_example": "'hit', ['hot','dot','dog']",
        "output_example": "['hot']"
    },
    {
        "id": 28,
        "difficulty": "hard",
        "title": "JSON Stringify",
        "description": "Convert a Python dict to a JSON-formatted string manually.",
        "input_example": "{'a': 1, 'b': 2}",
        "output_example": "'{\"a\":1,\"b\":2}'"
    },
    {
        "id": 29,
        "difficulty": "hard",
        "title": "Linked List Reverse",
        "description": "Reverse a linked list defined using Node objects.",
        "input_example": "1 -> 2 -> 3 -> None",
        "output_example": "3 -> 2 -> 1 -> None"
    },
    {
        "id": 30,
        "difficulty": "hard",
        "title": "Shortest Path BFS",
        "description": "Use BFS to find the shortest path in a 2D grid maze.",
        "input_example": "Grid with start and end points",
        "output_example": "Shortest distance (int)"
    }]



if not os.getenv("RENDER"):
    load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://api.gemini.com"


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/home")
def read_root():
	return{"message":"home"}

@app.get("/singleplayer")
def singleplayer():
    return{"mode":"singleplayer"}

@app.get("/singleplayer/easy")
def easy():
    challenge=random.choice(easy_challenges)
    return(challenge)

@app.get("/singleplayer/medium")
def medium():
    challenge=random.choice(medium_challenges)
    return(challenge)

@app.get("/singleplayer/hard")
def hard():
    challenge=random.choice(hard_challenges)
    return(challenge)


@app.post("/analyzing-code")
async def analyzing_easy_code(request: Request):
    data=await request.json()
    challenge_title=data.get("challenge_title", "Unknown Challenge")
    code=data.get("code", "")

    prompt=f"""
    you are a code evaluator for a coding game.
    Rate the following python code for the challange: '{challenge_title}'
    Give a score from 0-10 based on correctness, efficiency and readablity.
    Then explain why this code is good or bad in one sentence. Go straight to the point. 
    Score it even if the code isn't there. 
    Example output:
    Corectness: x/10 why is this code good or bad in terms of corectness.
    Efficiency: y/10 why is this code good or bad in terms of efficiency.
    Readability: z/10 why is this code good or bad in terms of readability.
    Don't be too strict.
    if the user code is remotely close to the correct code then give at least 3/10.
    Don't add any introduction like "I understand the task".
    Just give the scoring of the 
    Code:{code}
    """
    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    response = requests.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", headers=headers, json=data)
    if response.status_code == 200:
        candidates = response.json().get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            if parts:
                score_text = parts[0].get("text", "")
            else:
                score_text = "No content returned"
        else:
            score_text = "No candidates returned"
    else:
        score_text = f"Error: {response.status_code} - {response.text}"

    return {"Score": score_text}


@app.get("/vsAI/easy")
def easyAI():
    challenge=random.choice(easy_challenges)
    return(challenge)

@app.get("/vsAI/medium")
def mediumAI():
    challenge=random.choice(medium_challenges)
    return(challenge)

@app.get("/vsAI/hard")
def hardAI():
    challenge=random.choice(hard_challenges)
    return(challenge)


@app.post("/writing-easy-code")
async def writing_easy_code(request: Request):
    data=await request.json()
    challenge_title=data.get("challenge_title", "Unknown Challenge")
    code=data.get("code","")


    prompt=f"""
    you are playing against a beginner. You are building this mini project: '{challenge_title}'
    Write 4/10, 5/10 or 6/10 code for that project. 
    Then give a score from 0-10 based on correctness, efficiency and readability.
    Don't add any introduction or in-code comments.
    Don't add any explanation to your scoring.
    """
    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    response = requests.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", headers=headers, json=data)
    if response.status_code == 200:
        candidates = response.json().get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            if parts:
                easy_code = parts[0].get("text", "")
            else:
                easy_code = "No content returned"
        else:
            easy_code = "No candidates returned"
    else:
        easy_code = f"Error: {response.status_code} - {response.text}"

    return {"AI's code": easy_code}


@app.post("/writing-medium-code")
async def writing_medium_code(request: Request):
    data=await request.json()
    challenge_title=data.get("challenge_title", "Unknown Challenge")

    prompt=f"""
    you are playing against an intermediate. You are building this mini project: '{challenge_title}'
    Write 6/10 or 7/10 code for that project. Then give a score from 0-10 based on correctness, efficiency and readability.
    Don't add any introduction or in-code comments.
    Don't add any explanation to your scoring.
    """
    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    response = requests.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", headers=headers, json=data)
    if response.status_code == 200:
        candidates = response.json().get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            if parts:
                medium_code = parts[0].get("text", "")
            else:
                medium_code = "No content returned"
        else:
            medium_code = "No candidates returned"
    else:
        medium_code = f"Error: {response.status_code} - {response.text}"

    return {"AI's code": medium_code}

@app.post("/writing-hard-code")
async def writing_hard_code(request: Request):
    data=await request.json()
    challenge_title=data.get("challenge_title", "Unknown Challenge")

    prompt=f"""
    you are playing against an expert. You are building this mini project: '{challenge_title}'
    Write 8/10, 9/10 or 10/10  code for that project. Then give a score from 0-10 based on correctness, efficiency and readability.
    Don't add any introduction or in-code comments.
    Don't add any explanation to your scoring.
    """
    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    response = requests.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", headers=headers, json=data)
    if response.status_code == 200:
        candidates = response.json().get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            if parts:
                hard_code = parts[0].get("text", "")
            else:
                hard_code = "No content returned"
        else:
            hard_code = "No candidates returned"
    else:
        hard_code = f"Error: {response.status_code} - {response.text}"

    return {"AI's code": hard_code}

app.mount("/frontend", StaticFiles(directory="frontend", html=True), name="frontend")