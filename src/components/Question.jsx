import { nanoid } from "nanoid"
import { useEffect, useState, memo } from "react"
import "./Questions.css"
import classNames from "classnames"

//----------------------------------------//
// Put the logic for rendering classnames //
// in the main App.jsx file and create an //
// array of containing questions with an  //
// array of classNames for each question  //
//----------------------------------------//

function Question({ id, question, options, selectOption, gameSubmit }) {
    const renderOptions = options.map((option, index) => {
        return (
            <button
                key={option.id}
                id={option.id}
                className={
                    classNames(
                        {
                            "question--option-selected":
                                !gameSubmit && option.isSelected,
                        },
                        {
                            "question--option":
                                !gameSubmit && !option.isSelected,
                        },
                        {
                            "option--correct":
                                gameSubmit && option.isCorrectHeld,
                        },
                        {
                            "option--wrong": gameSubmit && option.isWrongHeld,
                        },
                        {
                            "option--not-selected":
                                gameSubmit && option.isNotHeld,
                        }
                    )
                    // option.isSelected
                    //     ? "question--option-selected"
                    //     : "question--option"
                }
                onClick={() => selectOption(id, option.id)}
            >
                {option.text}
            </button>
        )
    })

    return (
        <div className="question">
            <h2 className="question--head">{question}</h2>
            <div className="question--options">{renderOptions}</div>
            <hr className="question--line-break"></hr>
        </div>
    )
}

export default Question
