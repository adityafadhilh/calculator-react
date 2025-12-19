export function Speech() {
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
            <div className="rounded-full bg-blue-600 size-32 flex items-center justify-center text-white self-center mt-12 hover:animate-bounce">
                Mic
            </div>
        </div>
    )
}