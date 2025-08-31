import React, { useState } from "react";
import { Plus, Edit, Trash2, Ban, X } from "lucide-react";

const WordBanManager = ({
  bannedWords,
  showAddForm,
  onAddWord,
  onDeleteWord,
  onUpdateWord,
  setShowAddForm,
}) => {
  const [editingWord, setEditingWord] = useState(null);
  const [editData, setEditData] = useState({});
  const [wordFields, setWordFields] = useState(
    Array(16)
      .fill("")
      .map(() => ({ word: "" }))
  );

  const handleEdit = (word) => {
    setEditingWord(word._id);
    setEditData({
      word: word.word,
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

  // Add new word field (expand grid if needed)
  const addWordField = () => {
    setWordFields([...wordFields, { word: "" }]);
  };

  // Remove word field
  const removeWordField = (index) => {
    if (wordFields.length > 1) {
      const newFields = wordFields.filter((_, i) => i !== index);
      setWordFields(newFields);
    }
  };

  // Update word field
  const updateWordField = (index, value) => {
    const newFields = [...wordFields];
    newFields[index].word = value;
    setWordFields(newFields);
  };

  // Handle bulk add submission
  const handleBulkAdd = async (e) => {
    e.preventDefault();

    // Filter out empty word fields
    const validFields = wordFields.filter((field) => field.word.trim() !== "");

    if (validFields.length === 0) {
      alert("Please add at least one word to ban");
      return;
    }

    // Add each word
    for (const field of validFields) {
      if (field.word.trim()) {
        await onAddWord(e, {
          word: field.word.trim(),
        });
      }
    }

    // Reset form
    setWordFields(
      Array(16)
        .fill("")
        .map(() => ({ word: "" }))
    );
    setShowAddForm(false);
  };

  // Calculate grid columns based on number of fields
  const getGridCols = (count) => {
    if (count <= 4) return "grid-cols-2";
    if (count <= 8) return "grid-cols-3";
    if (count <= 12) return "grid-cols-4";
    if (count <= 16) return "grid-cols-4";
    return "grid-cols-5";
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
          Add Banned Words
        </button>
      </div>

      {/* Dynamic Add Form */}
      {showAddForm && (
        <div className="mb-8 p-4 md:p-6 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 font-['Comic_Sans_MS']">
              Add Multiple Banned Words
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-red-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleBulkAdd} className="space-y-4">
            {/* Compact Grid Layout */}
            <div className={`grid ${getGridCols(wordFields.length)} gap-3`}>
              {wordFields.map((field, index) => (
                <div key={index} className="relative">
                  <input
                    type="text"
                    value={field.word}
                    onChange={(e) => updateWordField(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-['Comic_Sans_MS'] text-sm"
                    placeholder={`Word ${index + 1}`}
                  />
                  {wordFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWordField(index)}
                      className="absolute -top-2 -right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors bg-white border border-red-200"
                      title="Remove this word field"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add More Fields Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={addWordField}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-['Comic_Sans_MS'] font-medium"
              >
                <Plus size={18} />
                Add More Fields
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-red-200">
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold"
              >
                Add All Words ({wordFields.filter((f) => f.word.trim()).length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setWordFields(
                    Array(16)
                      .fill("")
                      .map(() => ({ word: "" }))
                  );
                }}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banned Words List - Compact Grid */}
      <div className="space-y-4">
        {bannedWords.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-['Comic_Sans_MS']">
            <Ban size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No banned words yet.</p>
            <p className="text-sm">
              Add words to automatically censor them in user posts.
            </p>
          </div>
        ) : (
          <div className={`grid ${getGridCols(bannedWords.length)} gap-3`}>
            {bannedWords.map((word) => (
              <div
                key={word._id}
                className={`p-3 border rounded-lg ${
                  word.isActive
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {editingWord === word._id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editData.word}
                      onChange={(e) =>
                        setEditData({ ...editData, word: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-['Comic_Sans_MS']"
                    />
                    <div className="flex items-center gap-1">
                      <label className="flex items-center gap-1 text-xs font-medium text-gray-700 font-['Comic_Sans_MS']">
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
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSaveEdit(word._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-['Comic_Sans_MS']"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs font-['Comic_Sans_MS']"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 font-['Comic_Sans_MS'] text-sm truncate">
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

                    <p className="text-xs text-gray-500 font-['Comic_Sans_MS']">
                      Added: {new Date(word.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(word)}
                        className={`px-2 py-1 rounded text-xs font-['Comic_Sans_MS'] ${
                          word.isActive
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {word.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleEdit(word)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => onDeleteWord(word._id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
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
          <li>
            • Use the compact grid to efficiently ban multiple words at once
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WordBanManager;
