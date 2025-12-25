import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";
import listeningAnim from '../assets/animations/listening.json';
import { evaluate } from 'mathjs';

export function Speech() {
    const [isListening, setIsListening] = useState<boolean>(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<boolean>(false);
    const [result, setResult] = useState('');
    const [lang, setLang] = useState('en-US');

    const recognitionRef = useRef<any>(null);

    const languages = [
        { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
        { code: 'id-ID', label: 'Indonesian', flag: '🇮🇩' },
        { code: 'es-ES', label: 'Spanish', flag: '🇪🇸' },
        { code: 'fr-FR', label: 'French', flag: '🇫🇷' },
        { code: 'de-DE', label: 'German', flag: '🇩🇪' },
        { code: 'ja-JP', label: 'Japanese', flag: '🇯🇵' },
    ];

    const speechMap: Record<string, string> = {
        // Shared / English
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
        'plus': '+', 'minus': '-', 'times': '*', 'multiplied by': '*',
        'divided by': '/', 'divided': '/', 'over': '/', 'squared': '^2', 'cubed': '^3',
        'to the power of': '^', 'percent': '/100', 'point': '.',
        'thousand': '*1000', 'million': '*1000000', 'billion': '*1000000000',
        'of': '*', 'and': '+',
        // Indonesian
        'nol': '0', 'satu': '1', 'dua': '2', 'tiga': '3', 'empat': '4',
        'lima': '5', 'enam': '6', 'tujuh': '7', 'delapan': '8', 'sembilan': '9', 'sepuluh': '10',
        'tambah': '+', 'kurang': '-', 'kali': '*', 'bagi': '/', 'persen': '/100',
        'pangkat': '^', 'titik': '.', 'ribu': '*1000', 'juta': '*1000000',
        'miliar': '*1000000000', 'triliun': '*1000000000000',
        // Spanish
        'cero': '0', 'uno': '1', 'dos': '2', 'tres': '3', 'cuatro': '4',
        'cinco': '5', 'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9', 'diez': '10',
        'más': '+', 'menos': '-', 'por': '*', 'dividido': '/', 'entre': '/',
        'ciento': '/100', 'cuadrado': '^2', 'cubo': '^3', 'elevado': '^',
        'mil': '*1000', 'millón': '*1000000',
        // French
        'zéro': '0', 'un': '1', 'deux': '2', 'trois': '3', 'quatre': '4',
        'cinq': '5', 'sept': '7', 'huit': '8', 'neuf': '9', 'dix': '10',
        'fois': '*', 'divisé': '/', 'sur': '/', 'pour cent': '/100', 'carré': '^2', 'mille': '*1000',
        // German
        'null': '0', 'eins': '1', 'zwei': '2', 'drei': '3', 'vier': '4',
        'fünf': '5', 'sechs': '6', 'sieben': '7', 'acht': '8', 'neun': '9', 'zehn': '10',
        'mal': '*', 'geteilt': '/', 'durch': '/', 'prozent': '/100', 'quadrat': '^2', 'hoch': '^', 'tausend': '*1000',
        // Japanese
        'ゼロ': '0', '一': '1', '二': '2', '三': '3', '四': '4', '五': '5',
        '六': '6', '七': '7', '八': '8', '九': '9', '十': '10',
        'プラス': '+', 'マイナス': '-', 'かける': '*', 'わる': '/',
        'パーセント': '/100', '二乗': '^2', '乗': '^', '点': '.',
        '千': '*1000', '万': '*10000', '百万': '*1000000',
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const processCommand = (rawCommand: string) => {
        let command = rawCommand.toLowerCase();

        // Strip commas and spaces from numbers
        command = command.replace(/(\d)[, ](\d)/g, '$1$2');

        // Apply mapping
        Object.entries(speechMap).forEach(([word, op]) => {
            const regex = new RegExp(`(?<![a-z])${word}(?![a-z])`, 'g');
            command = command.replace(regex, op);
        });

        // Clean up expression
        command = command.replace(/[^0-9+\-*/^().]/g, ' ').trim();
        command = command.replace(/\s+/g, ' ');

        try {
            const calculationResult = evaluate(command);
            const formattedResult = calculationResult.toString();
            setResult(formattedResult);

            const currentLangCode = lang.split('-')[0];
            const prefixes: Record<string, string> = {
                'en': 'The answer is ',
                'id': 'Jawabannya adalah ',
                'es': 'La respuesta es ',
                'fr': 'La réponse est ',
                'de': 'Die Antwort ist ',
                'ja': '答えは ',
            };
            const prefix = prefixes[currentLangCode] || prefixes['en'];
            speak(`${prefix} ${formattedResult}`);
            return formattedResult;
        } catch (err) {
            setError(true);
            const currentLangCode = lang.split('-')[0];
            const errors: Record<string, string> = {
                'en': "Sorry, I couldn't understand that.",
                'id': 'Maaf, saya tidak mengerti.',
                'es': 'Lo siento, no entiendo.',
                'fr': 'Désolé, je ne comprends pas.',
                'de': 'Es tut mir leid, ich verstehe das nicht.',
                'ja': 'すみません、わかりませんでした。',
            };
            speak(errors[currentLangCode] || errors['en']);
            return '';
        }
    };

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error("Browser does not support Speech Recognition.");
            return;
        }

        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.lang = lang;
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onresult = (event: any) => {
            const command = event.results[0][0].transcript;
            setTranscript(command);
            setIsListening(false);
            processCommand(command);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
        };
    }, [lang]);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            setError(false);
            setResult('');
            setTranscript('');
            recognitionRef.current.start();
        }
    };

    const t = (key: string) => {
        const translations: Record<string, any> = {
            'howToUse': {
                'en': 'How to use:',
                'id': 'Cara menggunakan:',
                'es': 'Cómo utilizar:',
                'fr': 'Comment utiliser :',
                'de': 'Wie benutzt man:',
                'ja': '使い方:',
            },
            'instruction1': {
                'en': 'Click the microphone and speak your math problem',
                'id': 'Klik mikrofon dan ucapkan soal matematika',
                'es': 'Haz clic en el micrófono y di tu problema matemático.',
                'fr': 'Cliquez sur le microphone et énoncez votre problème mathématique',
                'de': 'Klicken Sie auf das Mikrofon und sprechen Sie Ihr mathematisches Problem',
                'ja': 'マイクをクリックして数学の問題を話してください',
            },
            'instruction2': {
                'en': 'Example: "five squared plus twelve"',
                'id': 'Contoh: "lima kali lima", "sepuluh dibagi dua"',
                'es': 'Ejemplo: "cinco al cuadrado más doce"',
                'fr': 'Exemple : "cinq au carré plus douze"',
                'de': 'Beispiel: "fünf im Quadrat plus zwölf"',
                'ja': '例：「5の2乗プラス12」',
            },
            'youSaid': {
                'en': 'You said:',
                'id': 'Anda mengucapkan:',
                'es': 'Dijiste:',
                'fr': 'Vous avez dit :',
                'de': 'Du sagtest:',
                'ja': 'あなたは言いました：',
            },
            'answer': {
                'en': 'Answer',
                'id': 'Jawaban',
                'es': 'Respuesta',
                'fr': 'Réponse',
                'de': 'Antwort',
                'ja': '答え',
            },
            'errorMsg': {
                'en': "Couldn't calculate that. Please try a clearer expression!",
                'id': 'Tidak bisa menghitung itu. Coba lagi dengan lebih jelas!',
                'es': 'No se pudo calcular eso. ¡Intenta una expresión más clara!',
                'fr': 'Impossible de calculer cela. Veuillez essayer une expression plus claire !',
                'de': 'Das konnte nicht berechnet werden. Bitte versuchen Sie einen klareren Ausdruck!',
                'ja': '計算できませんでした。もっと明確な表現を試してください！',
            },
            'title': {
                'en': 'Speech Calculator',
                'id': 'Kalkulator Suara',
                'es': 'Calculadora de voz',
                'fr': 'Calculatrice vocal',
                'de': 'Sprachrechner',
                'ja': '音声電卓',
            },
            'repeatAnswer': {
                'en': 'Repeat answer',
                'id': 'Ulangi jawaban',
                'es': 'Repetir respuesta',
                'fr': 'Répéter la réponse',
                'de': 'Antwort wiederholen',
                'ja': '答えを繰り返す',
            }
        };
        const currentLang = lang.split('-')[0];
        return translations[key]?.[currentLang] || translations[key]?.['en'];
    };

    return (
        <div className="w-full h-fit rounded-3xl p-8 mt-10 flex flex-col shadow-gray-400 shadow-2xl bg-white border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h3 className="text-2xl font-bold">{t('title')}</h3>
                <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all"
                >
                    {languages.map((l) => (
                        <option key={l.code} value={l.code}>
                            {l.flag} {l.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8">
                <p className="font-semibold text-blue-800 mb-2">
                    {t('howToUse')}
                </p>
                <ul className="text-blue-700 text-sm space-y-2 list-disc ml-4">
                    <li>{t('instruction1')}</li>
                    <li>{t('instruction2')}</li>
                </ul>
            </div>

            <button
                disabled={isListening}
                onClick={startListening}
                className={`group relative rounded-full flex w-64 h-64 items-center justify-center self-center mb-8 transition-transform hover:scale-105 active:scale-95 ${isListening ? 'bg-red-50' : 'bg-blue-50'
                    }`}
            >
                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isListening ? 'bg-red-400' : 'hidden'}`}></div>
                <Lottie
                    autoplay={isListening}
                    animationData={listeningAnim}
                    loop={isListening}
                    style={{ width: '100%', height: '100%' }}
                />
            </button>

            {transcript && (
                <div className="mb-4 animate-fade-in">
                    <p className="text-sm text-gray-500 mb-1">{t('youSaid')}</p>
                    <p className="text-lg font-medium text-gray-800 italic">"{transcript}"</p>
                </div>
            )}

            {result && !error && (
                <div className="rounded-2xl p-6 w-full bg-green-50 border border-green-200 animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 mb-1">{t('answer')}</p>
                            <p className="text-3xl font-bold text-green-800">{result}</p>
                        </div>
                        <button
                            onClick={() => speak(result)}
                            className="p-3 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                            title={t('repeatAnswer')}
                        >
                            🔊
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="w-full p-4 rounded-xl bg-red-50 border border-red-100 text-center text-red-600 animate-shake">
                    <span>{t('errorMsg')}</span>
                </div>
            )}
        </div>
    )
}
