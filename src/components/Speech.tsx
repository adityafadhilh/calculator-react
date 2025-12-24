import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";
import listeningAnim from '../assets/animations/listening.json';
import { evaluate } from 'mathjs';

export function Speech() {
    const [isListening, setIsListening] = useState<boolean>(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<boolean>(false);
    const [result, setResult] = useState('');

    const recognitionRef = useRef<any>(null);

    const calculate = (command: string) => {
        try {
            const calculationResult = evaluate(command);
            return calculationResult.toString();
        } catch (err) {
            setError(true);
            return '';
        }
    };

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error("Browser does not support Speech Recognition.");
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onresult = (event: any) => {
            const command = event.results[0][0].transcript;
            setTranscript(command);
            setIsListening(false);
            const res = calculate(command);
            console.log(res);
            setResult(res);
            console.log('Voice command received:', command);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            setError(false);
            recognitionRef.current.start();
        }
    };

    return (
        <div className="w-full h-fit rounded-2xl p-4 mt-10 flex flex-col shadow-gray-400 shadow-2xl inset-shadow-2xs">
            <h3 className="text-xl font-bold mb-4">Speech Calculator</h3>
            <div className="bg-blue-100 px-4 py-2 rounded-2xl">
                <p>How to use:</p>
                <li>Click the microphone button and speak your calculation</li>
                <li>Example "five plus three times two"</li>
                <li>Example "ten minus four divided by two"</li>
                <li>use words like: plus, minus, times, divided by, squared, cubed</li>
            </div>
            {/* <div onClick={startListening} className="rounded-full bg-blue-600 size-32 flex items-center justify-center text-white self-center mt-12 hover:animate-bounce">
                Mic
            </div> */}
            <button disabled={isListening} onClick={startListening} className="rounded-full flex w-96 items-center justify-center text-white self-center mt-12">
                <Lottie autoplay={isListening} animationData={listeningAnim} loop={isListening} />
            </button>
            {result && transcript && !error &&
                <div className="rounded-2xl p-3 w-full bg-green-200 flex items-center space-x-2">
                    <p className="text-2xl font-bold">Answer: </p>
                    <p className="text-xl">{transcript} = {result}</p>
                </div>
            }

            {error && (
                <div className="w-full text-center text-red-600">
                    <span>{'Could not calculate. Please try again with a clearer expression.'}</span>
                </div>
            )}
        </div>
    )
}