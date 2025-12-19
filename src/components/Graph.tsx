export function Graph() {
    return (
        <div className="shadow-gray-400 shadow-2xl inset-shadow-2xs w-full h-fit rounded-2xl p-4 mt-10">
            <h3 className="text-xl font-bold mb-4">Graph Visualizer</h3>
            <p className="block mb-2">{'Equation (use "x" as variable):'}</p>
            <input className="border-2 border-gray-400 rounded-md w-full p-2"></input>
            <div className="flex space-x-4 mt-4">
                <div className="flex-1">
                    <p className="mb-2">{'Min X:'}</p>
                    <input className="border-2 border-gray-400 rounded-md w-full p-2"></input>
                </div>
                <div className="flex-1"> 
                    <p className="mb-2">{'Max X:'}</p>
                    <input className="border-2 border-gray-400 rounded-md w-full p-2"></input>
                </div>
            </div>
            <p className="my-2">{'Preset Equations:'}</p>
            <div className="flex space-x-3 pt-2">
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Quadratic</div>
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Cubic</div>
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Sine</div>
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Cosine</div>
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Exponential</div>
                <div className="bg-gray-200 rounded-xl px-4 py-2 text-md">Logarithm</div>
            </div>
            <div className="bg-blue-600 w-full mt-4 text-white p-2 font-bold text-center rounded-2xl">
                Generate Graph
            </div>
            <div className="border-2 border-gray-400 min-h-96 mt-4 rounded-2xl resize-y">
                
            </div>
        </div>
    )
}