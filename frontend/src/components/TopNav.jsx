import { Search } from 'lucide-react'

export default function TopNav() {
    return (
        <div>
            {/* Search Input - Top Left */}
            <div className="absolute top-4 left-4 z-[1000] w-80">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for places"
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-full shadow-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 placeholder-gray-500"
                    />
                </div>
            </div>
        </div>
    );
}

