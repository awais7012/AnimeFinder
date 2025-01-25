import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Instagram, Upload, Zap } from 'lucide-react';

export default function AnimeSearch() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('https://api.trace.moe/search?cutBorders=true', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error('Rate limit exceeded - Try again later');
        throw new Error('Failed to search anime');
      }

      const data = await response.json();
      setResults(data.result?.slice(0, 5) || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
    const date = new Date(seconds * 1000);
    return date.toISOString().substr(11, 8);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Romeo
            </motion.h1>
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Trace Back the Scene
          </h2>
          <p className="text-gray-400 text-lg">
            From an anime screenshot
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="mb-8">
          <motion.div 
            className="bg-gray-800 p-8 rounded-lg border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors cursor-pointer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0])}
              ref={fileInputRef}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <Upload className="w-12 h-12 text-purple-400" />
              <p className="text-lg text-gray-300">
                {file ? file.name : 'Drop image here or click to upload'}
              </p>
            </div>
          </motion.div>
          
          <motion.button
            type="submit"
            disabled={!file || isLoading}
            className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Searching...' : 'Find Anime'}
          </motion.button>
        </form>

        {error && (
          <motion.div 
            className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-800 p-6 rounded-lg shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h2 className="text-xl font-bold mb-2 text-purple-400">
                {result.anilist?.title?.english || result.anilist?.title?.romaji || 'Unknown Title'}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <p><span className="font-semibold text-purple-400">Episode:</span> {result.episode || 'Unknown'}</p>
                  <p><span className="font-semibold text-purple-400">Similarity:</span> {(result.similarity * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p><span className="font-semibold text-purple-400">From:</span> {formatTime(result.from)}</p>
                  <p><span className="font-semibold text-purple-400">To:</span> {formatTime(result.to)}</p>
                </div>
              </div>

              {result.video && (
                <div className="mt-4">
                  <video 
                    controls 
                    className="w-full rounded-lg"
                    src={result.video}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div 
            className="flex justify-center space-x-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a 
              href="https://github.com/awais7012"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Github className="w-6 h-6" />
              <span>github.com/awais7012</span>
            </a>
            <a 
              href="https://www.instagram.com/_awai_s"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span>_awai_s</span>
            </a>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}