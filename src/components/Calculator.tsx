import { useState } from "react"
import { evaluate } from "mathjs";

export function Calculator() {
    const [display, setDisplay] = useState<string>('0');
    const [parenthesesStack, setParenthesesStack] = useState([]);
    const buttons = [
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['0', '.', '=', '+'],
        // ['+/-', '()', '%']
    ];

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
    };

    const handleEqual = () => {
        try {
            let res: number = evaluate(display);
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
        <div className="border-gray-400 rounded-2xl w-full mt-10 border-2 p-10">
            <div className="w-full text-right color-black rounded-2xl border-gray-400 text-3xl border-2 p-4">
                {display}
            </div>
            <div className='grid grid-cols-4 mt-8 mx-4'>
                {buttons.flat().map((btn) => {
                    return (
                        <div onClick={() => handleAddDisplay(btn)} className={`hover:cursor-pointer rounded-2x w-32 mx-1 h-24 text-center font-bold text-2xl p-8 mb-4 mr-4 ${btn === '=' ? 'bg-blue-600 text-white' :
                            btn.includes('/') || btn.includes('*') || btn.includes('-') || btn.includes('+') ? 'bg-orange-500 text-white' :
                                'bg-gray-200 text-black'
                            }`}>
                            {btn}
                        </div>
                    )
                })}
            </div>
            <div className="flex space-x-4 mb-4">
                <div onClick={() => handlePosNeg()} className="hover:cursor-pointer text-2xl flex-1 bg-yellow-700 p-4 ml-5 flex items-center justify-center text-white font-bold">{'+/-'}</div>
                <div onClick={() => handleParantheses('(')} className="hover:cursor-pointer flex-1 bg-yellow-700 mr-6 text-2xl items-center justify-center flex text-white font-bold">{'('}</div>
                <div onClick={() => handleParantheses(')')} className="hover:cursor-pointer flex-1 bg-yellow-700 mr-6 text-2xl items-center justify-center flex text-white font-bold">{')'}</div>
                <div onClick={handleBackspace} className="hover:cursor-pointer flex-1 bg-yellow-700 mr-6 text-2xl items-center justify-center flex text-white font-bold">{'%'}</div>
            </div>
            <div className="flex space-x-4">
                <div onClick={handleClear} className="hover:cursor-pointer text-2xl flex-1 bg-red-500 p-4 ml-5 flex items-center justify-center text-white">Clear</div>
                <div onClick={handleBackspace} className="hover:cursor-pointer flex-1 bg-gray-400 mr-6 text-2xl items-center justify-center flex text-white">{'<-'}</div>
            </div>
        </div>
    )
}