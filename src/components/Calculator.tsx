import { useState } from "react"
import { evaluate } from "mathjs";
import ReactMarkdown from 'react-markdown';
import axios from "axios";
import { CalculatorButton } from "./CalculatorButton";

export function Calculator() {
    const [display, setDisplay] = useState<string>('0');
    const [solution, setSolution] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const buttons = [
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['0', '.', '=', '+'],
    ];

    const handleAddNumber = (num: string) => {
        if (display === '0') {
            setDisplay(num);
        } else {
            const lastChar = display[display.length - 1];
            const isOp = ['/', '*', '-', '+'].includes(lastChar);
            setDisplay(display + (isOp ? ' ' + num : num));
        }
    };

    const handleAddOp = (op: string) => {
        setDisplay(display + ' ' + op);
    }

    const handleAddDisplay = (input: string) => {
        if (['/', '*', '-', '+'].includes(input)) {
            handleAddOp(input);
        } else if (input === '=') {
            handleEqual();
        } else {
            handleAddNumber(input);
        }
    };

    const handleBackspace = () => {
        setDisplay(display.length > 1 ? display.slice(0, -1).trim() : '0');
    };

    const handleClear = () => {
        setDisplay('0');
        setSolution('');
        setError(false);
    };

    const getSolution = async (expression: string) => {
        setIsLoading(true);
        try {
            const res = await axios.get(import.meta.env.VITE_API_SERVER + '/solution', {
                params: { calculation: expression }
            });
            setSolution(res.data.solution);
        } catch (err) {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEqual = () => {
        try {
            console.log(display);
            const res: number = evaluate(display);
            getSolution(display);
            setDisplay(res.toString());
        } catch (err) {
            setError(true);
        }
    };

    const handleParentheses = (input: string) => {
        setDisplay(display === '0' ? input : display + (input === '(' ? ' ' : '') + input);
    };

    const handlePosNeg = () => {
        const parts = display.trim().split(' ');
        console.log(parts);
        const lastPart = parts[parts.length - 1];
        console.log(lastPart);

        if (!lastPart || isNaN(Number(lastPart.replace(/[()]/g, '')))) return;

        if (lastPart.startsWith('(-')) {
            parts[parts.length - 1] = lastPart.slice(2, -1);
        } else {
            parts[parts.length - 1] = `(-${lastPart})`;
        }

        setDisplay(parts.join(' '));
    };

    const handlePresetParenthesis = (inputType: string) => {
        const parts = display.trim().split(' ');
        const lastPart = parts[parts.length - 1];

        if (!lastPart || isNaN(Number(lastPart.replace(/[()]/g, '')))) return;

        parts[parts.length - 1] = `${inputType}(${lastPart})`;

        console.log(parts);

        setDisplay(parts.join(' '));
    };

    const handleExponent = (exponent: string) => {
        const parts = display.trim().split(' ');
        const lastPart = parts[parts.length - 1];

        if (!lastPart || isNaN(Number(lastPart.replace(/[()]/g, '')))) return;

        console.log(exponent);
        if (exponent === 'y') {
            parts[parts.length - 1] = `${lastPart}^(`;
        } else {
            parts[parts.length - 1] = `${lastPart}^${exponent}`;
        }

        setDisplay(parts.join(' '));
    }

    const handlePercentage = () => {
        try {
            const res = evaluate(`${display} / 100`);
            setDisplay(res.toString());
        } catch (err) {
            setError(true);
        }
    }

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <div className="rounded-3xl w-full mt-10 p-6 md:p-10 shadow-gray-400 shadow-2xl bg-white">
                <div className="w-full text-right text-black rounded-2xl border-gray-200 text-4xl font-mono border-2 p-6 mb-8 overflow-x-auto">
                    {display}
                </div>

                <div className='grid grid-cols-4 gap-4 mb-4 justify-items-center'>
                    {buttons.flat().map((btn) => (
                        <CalculatorButton
                            key={btn}
                            onClick={() => handleAddDisplay(btn)}
                            variant={btn === '=' ? 'equals' : (['/', '*', '-', '+'].includes(btn) ? 'operator' : 'default')}
                            className="w-full h-20 md:h-24"
                        >
                            {btn}
                        </CalculatorButton>
                    ))}
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4 justify-items-center">
                    <CalculatorButton onClick={handlePosNeg} variant="action" className="w-full h-20 md:h-24">{'+/-'}</CalculatorButton>
                    <CalculatorButton onClick={() => handleParentheses('(')} variant="action" className="w-full h-20 md:h-24">{'('}</CalculatorButton>
                    <CalculatorButton onClick={() => handleParentheses(')')} variant="action" className="w-full h-20 md:h-24">{')'}</CalculatorButton>
                    <CalculatorButton onClick={handlePercentage} variant="action" className="w-full h-20 md:h-24">{'%'}</CalculatorButton>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4 justify-items-center">
                    <CalculatorButton onClick={() => handlePresetParenthesis('sin')} variant="action" className="w-full h-20 md:h-24">{'sin(x)'}</CalculatorButton>
                    <CalculatorButton onClick={() => handlePresetParenthesis('tan')} variant="action" className="w-full h-20 md:h-24">{'tan(x)'}</CalculatorButton>
                    <CalculatorButton onClick={() => handlePresetParenthesis('cos')} variant="action" className="w-full h-20 md:h-24">{'cos(x)'}</CalculatorButton>
                    <CalculatorButton onClick={() => handlePresetParenthesis('log')} variant="action" className="w-full h-20 md:h-24">{'log(x)'}</CalculatorButton>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 justify-items-center">
                    <CalculatorButton onClick={() => handleExponent('2')} variant="action" className="w-full h-20 md:h-24">{'x^2'}</CalculatorButton>
                    <CalculatorButton onClick={() => handleExponent('y')} variant="action" className="w-full h-20 md:h-24">{'x^(y)'}</CalculatorButton>
                </div>

                <div className="grid grid-cols-2 gap-4 justify-items-center">
                    <CalculatorButton onClick={handleClear} variant="clear" className="w-full h-20 md:h-24">Clear</CalculatorButton>
                    <CalculatorButton onClick={handleBackspace} variant="default" className="w-full h-20 md:h-24">{'←'}</CalculatorButton>
                </div>
            </div>

            {isLoading && (
                <div className="w-full mt-10 flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            )}

            {solution && !isLoading && (
                <div className="rounded-2xl w-full mt-10 p-8 shadow-lg bg-green-50 border border-green-200 mb-20 prose max-w-none">
                    <h3 className="text-xl font-bold mb-4 text-green-800">Solution Analysis</h3>
                    <ReactMarkdown>{solution}</ReactMarkdown>
                </div>
            )}

            {error && (
                <div className="rounded-2xl w-full mt-10 p-6 shadow-lg bg-red-50 border border-red-200 mb-20">
                    <p className="text-lg text-red-600 font-semibold">Error processing calculation or fetching solution.</p>
                </div>
            )}
        </div>
    )
}
