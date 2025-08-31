import React, { useState } from "react";
import { Plus, Edit, Trash2, Ban } from "lucide-react";

const WordBanManager = ({
  bannedWords,
  showAddForm,
  newWord,
  onAddWord,
  onDeleteWord,
  onUpdateWord,
  onInputChange,
  onResetForm,
  setShowAddForm,
}) => {
  const [editingWord, setEditingWord] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (word) => {
    setEditingWord(word._id);
    setEditData({
      word: word.word,
      reason: word.reason || "",
      isActive: word.isActive,
    });
  };

  const handleSaveEdit = async (wordId) => {
    const success = await onUpdateWord(wordId, editData);
    if (success) {
      setEditingWord(null);
      setEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingWord(null);
    setEditData({});
  };

  const handleToggleActive = async (word) => {
    await onUpdateWord(word._id, { isActive: !word.isActive });
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
          Word Banning
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold touch-manipulation flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Banned Word
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-8 p-4 md:p-6 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 font-['Comic_Sans_MS'] mb-4">
            Add New Banned Word
          </h3>
          <form onSubmit={onAddWord} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-['Comic_Sans_MS']">
                  Word *
                </label>
                <input
                  type="text"
                  value={newWord.word}
                  onChange={(e) => onInputChange("word", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-['Comic_Sans_MS']"
                  placeholder="Enter word to ban"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-['Comic_Sans_MS']">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={newWord.reason}
                  onChange={(e) => onInputChange("reason", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-['Comic_Sans_MS']"
                  placeholder="Why is this word banned?"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold"
              >
                Add Word
              </button>
              <button
                type="button"
                onClick={onResetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banned Words List */}
      <div className="space-y-3">
        {bannedWords.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-['Comic_Sans_MS']">
            <Ban size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No banned words yet.</p>
            <p className="text-sm">
              Add words to automatically censor them in user posts.
            </p>
          </div>
        ) : (
          bannedWords.map((word) => (
            <div
              key={word._id}
              className={`p-4 border rounded-lg ${
                word.isActive
                  ? "border-red-200 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {editingWord === word._id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editData.word}
                      onChange={(e) =>
                        setEditData({ ...editData, word: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-['Comic_Sans_MS']"
                    />
                    <input
                      type="text"
                      value={editData.reason}
                      onChange={(e) =>
                        setEditData({ ...editData, reason: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-['Comic_Sans_MS']"
                      placeholder="Reason (optional)"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 font-['Comic_Sans_MS']">
                      <input
                        type="checkbox"
                        checked={editData.isActive}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            isActive: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      Active
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(word._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-['Comic_Sans_MS']"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-['Comic_Sans_MS']"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 font-['Comic_Sans_MS']">
                        {word.word}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          word.isActive
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        } font-['Comic_Sans_MS']`}
                      >
                        {word.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {word.reason && (
                      <p className="text-sm text-gray-600 mt-1 font-['Comic_Sans_MS']">
                        Reason: {word.reason}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 font-['Comic_Sans_MS']">
                      Added: {new Date(word.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(word)}
                      className={`px-3 py-1 rounded text-sm font-['Comic_Sans_MS'] ${
                        word.isActive
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {word.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleEdit(word)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteWord(word._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2 font-['Comic_Sans_MS']">
          How Word Banning Works
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 font-['Comic_Sans_MS']">
          <li>
            • Banned words are automatically replaced with asterisks (****) in
            user posts
          </li>
          <li>
            • Users can still post content with banned words - they just get
            censored
          </li>
          <li>• Only active banned words are applied</li>
          <li>
            • Words are case-insensitive (e.g., "Bobo" and "bobo" are both
            censored)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WordBanManager;
