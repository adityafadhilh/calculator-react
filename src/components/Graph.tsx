export function Graph() {
    return (
        <div className="border-2 border-gray-400 w-full h-fit rounded-2xl p-4 mt-10">
            <h3 className="text-xl font-bold mb-4">Graph Visualizer</h3>
            <label className="block mb-2">{'Equation (use "x" as variable):'}</label>
            <input className="border-2 border-gray-400 rounded-md w-full p-2"></input>
            <div className="flex space-x-4 mt-4">
                <div className="flex-1">
                    <label className="mb-2">{'Min X:'}</label>
                    <input className="border-2 border-gray-400 rounded-md w-full p-2"></input>
                </div>
                <div className="flex-1"> 
                    <label className="mb-2">{'Max X:'}</label>
                    <input className="border-2 border-gray-400 rounded-md w-full p-2"></input>
                </div>
            </div>
            <div className="bg-blue-600 w-full mt-8 text-white p-2 font-bold text-center rounded-2xl">
                Generate Graph
            </div>
        </div>
    )
}