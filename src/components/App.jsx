import React, { useEffect, useState } from "react"
import "./App.css"

import Question from "./Question"
import { nanoid } from "nanoid"

// create an array of objects
// store the selected answer, correct answer and whether the answer is right or wrong
// pass down the object to child components, conditionally render CSS

function App() {
    function decodeEntities(s) {
        let str,
            temp = document.createElement("p")
        temp.innerHTML = s
        str = temp.textContent || temp.innerText
        temp = null
        return str
    }

    function shuffleArray(arr) {
        return arr.sort(() => Math.random() - 0.5)
    }

    function createOptions(correctAnswer, incorrectAnswers) {
        let arr = []
        for (let i = 0; i < 3; i++) {
            arr.push(incorrectAnswers[i])
        }
        arr.push(correctAnswer)

        arr = shuffleArray(arr)

        arr = arr.map((option) => {
            return {
                id: nanoid(),
                text: decodeEntities(option),
                isSelected: false,
                isCorrectHeld: false,
                isWrongHeld: false,
                isNotHeld: false,
            }
        })

        return arr
    }

    /*-----STATE-----*/
    const [quizStart, setQuizStart] = useState(false)
    const [questions, setQuestions] = useState([])
    const [notAnsweredAll, setNotAnsweredAll] = useState(false)
    const [numCorrectAnswers, setNumCorrectAnswers] = useState(0)
    const [answers, setAnswers] = useState([])
    const [newGame, setNewGame] = useState(false)
    const [gameSubmit, setGameSubmit] = useState(false)

    /*-----USEEFFECT-----*/
    useEffect(() => {
        fetch(
            "https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple"
        )
            .then((res) => res.json())
            .then((data) => {
                setQuestions(generateQuestions(data.results))
            })
        setNewGame(false)
    }, [newGame])

    useEffect(() => {
        const answersArr = []
        for (let i = 0; i < 5; i++) {
            questions[i]?.options.map((option) => {
                if (option?.isSelected) {
                    answersArr.push(option)
                }
            })
        }
        let newAns = answersArr.map((answer, index) => {
            return {
                userAnswer: answer.text,
                correctAnswer: questions[index].correctAnswer,
                isCorrectHeld: answer.text === questions[index].correctAnswer,
            }
        })

        setAnswers(newAns)
    }, [questions])

    /*-----OTHER-----*/

    // Selecting and unselection options
    function selectOption(questionId, optionId) {
        const newQuestions = questions.map((question) => {
            if (question.id === questionId) {
                return {
                    ...question,
                    options: question.options.map((option) => {
                        if (option.isSelected) {
                            return { ...option, isSelected: false }
                        }
                        if (option.id === optionId) {
                            return { ...option, isSelected: !option.isSelected }
                        } else {
                            return option
                        }
                    }),
                }
            } else {
                return question
            }
        })
        setQuestions((oldQuestions) => newQuestions)
    }

    function startQuiz() {
        setQuizStart(true)
        setNewGame(false)
    }

    function generateQuestions(input) {
        let arr = []
        for (let i = 0; i < 5; i++) {
            arr.push({
                id: nanoid(),
                text: input[i].question,
                options: createOptions(
                    input[i].correct_answer,
                    input[i].incorrect_answers
                ),
                correctAnswer: input[i].correct_answer,
            })
        }
        return arr
    }

    function restartGame() {
        setNewGame(true)
        setQuestions([])
        setNotAnsweredAll(false)
        setNumCorrectAnswers(0)
        setAnswers([])
        setGameSubmit(false)
    }

    function checkAnswers() {
        if (answers.length < 5) {
            setNotAnsweredAll(true)
        } else {
            setQuestions((oldQuestions) => {
                return oldQuestions.map((question) => {
                    return {
                        ...question,
                        options: question.options.map((option) => {
                            if (
                                // option.isSelected &&
                                option.text === question.correctAnswer
                            ) {
                                return { ...option, isCorrectHeld: true }
                            } else if (
                                option.isSelected &&
                                option.text !== question.correctAnswer
                            ) {
                                return { ...option, isWrongHeld: true }
                            } else {
                                return { ...option, isNotHeld: true }
                            }
                        }),
                    }
                })
            })

            setNumCorrectAnswers(() => {
                const arr = answers.filter((answer) => answer.isCorrectHeld)

                return arr.length
            })
            setGameSubmit(true)
            setNotAnsweredAll(false)
        }
    }

    const renderQuestions = questions.map((question) => {
        return (
            <Question
                key={question.id}
                id={question.id}
                question={decodeEntities(question.text)}
                options={question.options}
                selectOption={selectOption}
                gameSubmit={gameSubmit}
            />
        )
    })

    return quizStart ? (
        <div className="quiz">
            <div className="all-questions">{renderQuestions}</div>
            {notAnsweredAll && (
                <h2 className="warning">You must attempt all questions!</h2>
            )}
            <div className="check-answers">
                {!gameSubmit && (
                    <button
                        className="check-answers-btn"
                        onClick={checkAnswers}
                    >
                        Check Answers
                    </button>
                )}
                {gameSubmit && (
                    <div className="end-game">
                        <h3>You have {numCorrectAnswers}/5 correct answers</h3>
                        <button className="new-game-btn" onClick={restartGame}>
                            New Game
                        </button>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div className="landing">
            <h1 className="landing--title">Quizzical</h1>
            <p className="landing--description">Some description if needed</p>
            <button
                className="landing--start-quiz-btn"
                onClick={() => startQuiz()}
            >
                Start Quiz
            </button>
        </div>
    )
}

export default App
