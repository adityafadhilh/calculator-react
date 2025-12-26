import { useState } from "react"
import { evaluate } from "mathjs";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import axios from "axios";
import ChevronDownIcon from "../assets/icons/ChevronDownIcon";
import ChevronUpIcon from "../assets/icons/ChevronUpIcon";

export function Calculator() {
    const [display, setDisplay] = useState<string>('0');
    const [parenthesesStack, setParenthesesStack] = useState([]);
    const [solution, setSolution] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const buttons = [
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['0', '.', '=', '+'],
        // ['+/-', '(', ')', '%']
    ];

    // const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    // const ai = new GoogleGenAI({
    //     apiKey: API_KEY
    // });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showMore, setShowMore] = useState<boolean>(false);

    const handleAddNumber = (num: string) => {
        if (display == '0') {
            setDisplay(num);
        } else {
            let lastDisplay = display[display.length - 1];
            if (lastDisplay.includes('/') || lastDisplay.includes('*') || lastDisplay.includes('-') || lastDisplay.includes('+')) {
                setDisplay(display + ' ' + num);
            } else {
                setDisplay(display + num);
            }
        }
    };

    const handleAddOp = (op: string) => {
        setDisplay(display + ' ' + op);
    }

    const handleAddDisplay = (input: string) => {
        if (input.includes('/') || input.includes('*') || input.includes('-') || input.includes('+')) {
            handleAddOp(input);
        } else if (input === '=') {
            handleEqual();
        } else {
            handleAddNumber(input);
        }
    };

    const handleBackspace = () => {
        setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    };

    const handleClear = () => {
        setDisplay('0');
        setSolution('');
        setError(false);
    };

    const getSolution = async () => {
        setIsLoading(true);
        try {
            // const response = await ai.models.generateContent({
            //     model: "gemini-2.5-flash",
            //     contents: `Calculate ${display} and give step by step solution (without latex operation) using visual`,
            // });
            // console.log(response.text);
            // setSolution(response.text || '');
            // console.log(display);
            const res = await axios.get(import.meta.env.VITE_API_SERVER + '/solution', {
                params: {
                    calculation: display
                }
            });
            console.log(res);
            setSolution(res.data.solution);
        } catch (error) {
            console.log(error);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEqual = () => {
        try {
            let res: number = evaluate(display);
            getSolution();
            setDisplay(res.toString());
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    };

    const handleParantheses = (input: string) => {
        setDisplay(display + ' ' + input)
    };

    // WIP
    const handlePosNeg = () => {
        let splittedArr = display.split(' ');
        let splittedArrLength = splittedArr.length;
        let lastItem = splittedArr[splittedArrLength - 1];

        if (lastItem[0] !== '-') {
            console.log(splittedArr[splittedArrLength - 1]);
            lastItem = '(-' + lastItem + ')';
            let temp = [...display];
            console.log(temp)
            console.log(splittedArr)
            splittedArr.pop();
            splittedArr.push(lastItem);
            console.log(splittedArr);
            let revert: string = ""
            splittedArr.forEach((it) => {
                revert = revert + it;
            });
            if (revert) {
                setDisplay(revert)
            }

            // setDisplay(display.slice(0, -lastItem.length) + lastItem);
        }
    }

    return (
        <>
            <div className="rounded-2xl w-full mt-10 p-10 shadow-gray-400 shadow-2xl inset-shadow-2xs">
                <div className="w-full text-right color-black rounded-2xl border-gray-400 text-3xl border-2 p-4">
                    {display}
                </div>
                <div className='grid grid-cols-4 mt-8 mx-2'>
                    {buttons.flat().map((btn) => {
                        return (
                            <div key={btn} onClick={() => handleAddDisplay(btn)} className={`hover:cursor-pointer rounded-2xl w-32 h-24 text-center font-bold text-2xl p-8 mb-4 mr-4 ${btn === '=' ? 'bg-blue-600 text-white' :
                                btn.includes('/') || btn.includes('*') || btn.includes('-') || btn.includes('+') ? 'bg-orange-500 text-white' :
                                    'bg-gray-200 text-black'
                                }`}>
                                {btn}
                            </div>
                        )
                    })}
                </div>
                <div
                    onClick={() => {
                        setShowMore(!showMore)
                    }}
                    className="flex justify-center">
                    {showMore ?
                        <ChevronUpIcon color="gray" className="w-8" />
                        :
                        <ChevronDownIcon color="gray" className="w-8" />
                    }
                </div>
                {showMore &&
                    <>
                        <div className="grid grid-cols-4 mb-4 mx-2">
                            <div onClick={() => handlePosNeg()} className="hover:cursor-pointer text-2xl w-32 h-24  bg-yellow-700 p-4 flex items-center justify-center text-white font-bold rounded-2xl">{'+/-'}</div>
                            <div onClick={() => handleParantheses('(')} className="hover:cursor-pointer w-32 h-24 bg-yellow-700 text-2xl items-center justify-center flex text-white font-bold rounded-2xl">{'('}</div>
                            <div onClick={() => handleParantheses(')')} className="hover:cursor-pointer w-32 h-24 bg-yellow-700 text-2xl items-center justify-center flex text-white font-bold rounded-2xl">{')'}</div>
                            <div onClick={handleBackspace} className="hover:cursor-pointer w-32 h-24 bg-yellow-700 text-2xl items-center justify-center flex text-white font-bold rounded-2xl">{'%'}</div>
                        </div>
                        <div className="grid grid-cols-4 mb-4 mx-2">
                            <div onClick={() => handlePosNeg()} className="hover:cursor-pointer text-2xl w-32 h-24  bg-yellow-700 p-4 flex items-center justify-center text-white font-bold rounded-2xl">{'sin(x)'}</div>
                            <div onClick={() => handleParantheses('(')} className="hover:cursor-pointer w-32 h-24 bg-yellow-700 text-2xl items-center justify-center flex text-white font-bold rounded-2xl">{'cos(x)'}</div>
                            <div onClick={() => handleParantheses(')')} className="hover:cursor-pointer w-32 h-24 bg-yellow-700 text-2xl items-center justify-center flex text-white font-bold rounded-2xl">{'tan(x)'}</div>
                            <div onClick={handleBackspace} className="hover:cursor-pointer w-32 h-24 bg-yellow-700 text-2xl items-center justify-center flex text-white font-bold rounded-2xl">{'log(x)'}</div>
                        </div>
                        <div className="grid grid-cols-4 mb-4 mx-2">
                            <div onClick={() => handlePosNeg()} className="hover:cursor-pointer text-2xl w-32 h-24  bg-yellow-700 p-4 flex items-center justify-center text-white font-bold rounded-2xl">{'ln'}</div>
                            <div onClick={() => handleParantheses('(')} className="hover:cursor-pointer w-32 h-24 bg-yellow-700 text-2xl items-center justify-center flex text-white font-bold rounded-2xl">{'e'}</div>
                            <div onClick={() => handleParantheses(')')} className="hover:cursor-pointer w-32 h-24 bg-yellow-700 text-2xl items-center justify-center flex text-white font-bold rounded-2xl">{'x^2'}</div>
                            <div onClick={handleBackspace} className="hover:cursor-pointer w-32 h-24 bg-yellow-700 text-2xl items-center justify-center flex text-white font-bold rounded-2xl">{'x^y'}</div>
                        </div>
                    </>

                }
                <div className="grid grid-cols-2 mx-2 gap-1">
                    <div onClick={handleClear} className="hover:cursor-pointer h-24 text-2xl bg-red-500 p-4 flex items-center justify-center text-white rounded-2xl">Clear</div>
                    <div onClick={handleBackspace} className="hover:cursor-pointer h-24 bg-gray-400 text-2xl items-center justify-center flex text-white rounded-2xl">{'<-'}</div>
                </div>
            </div>
            {isLoading &&
                <div className="w-full mt-10 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="animate-spin w-8">
                        <path d="M272 112C272 85.5 293.5 64 320 64C346.5 64 368 85.5 368 112C368 138.5 346.5 160 320 160C293.5 160 272 138.5 272 112zM272 528C272 501.5 293.5 480 320 480C346.5 480 368 501.5 368 528C368 554.5 346.5 576 320 576C293.5 576 272 554.5 272 528zM112 272C138.5 272 160 293.5 160 320C160 346.5 138.5 368 112 368C85.5 368 64 346.5 64 320C64 293.5 85.5 272 112 272zM480 320C480 293.5 501.5 272 528 272C554.5 272 576 293.5 576 320C576 346.5 554.5 368 528 368C501.5 368 480 346.5 480 320zM139 433.1C157.8 414.3 188.1 414.3 206.9 433.1C225.7 451.9 225.7 482.2 206.9 501C188.1 519.8 157.8 519.8 139 501C120.2 482.2 120.2 451.9 139 433.1zM139 139C157.8 120.2 188.1 120.2 206.9 139C225.7 157.8 225.7 188.1 206.9 206.9C188.1 225.7 157.8 225.7 139 206.9C120.2 188.1 120.2 157.8 139 139zM501 433.1C519.8 451.9 519.8 482.2 501 501C482.2 519.8 451.9 519.8 433.1 501C414.3 482.2 414.3 451.9 433.1 433.1C451.9 414.3 482.2 414.3 501 433.1z" />
                    </svg>
                </div>
            }
            {solution &&
                <div className="rounded-2xl w-full mt-10 p-10 shadow-gray-400 shadow-2xl inset-shadow-2xs bg-green-200 mb-20">
                    <p className="text-2xl mb-4">Solution:</p>
                    <ReactMarkdown>{solution}</ReactMarkdown>
                </div>
            }
            {error &&
                <div className="rounded-2xl w-full mt-10 p-10 shadow-gray-400 shadow-2xl inset-shadow-2xs mb-20">
                    <p className="text-2xl mb-4 text-red-600">Failed to get solution</p>
                </div>
            }

        </>
    )
}