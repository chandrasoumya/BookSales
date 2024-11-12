from flask import Flask, jsonify, request
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load your recommendation model and data from the pickle file
with open('recommendation_data.pkl', 'rb') as file:
    loaded_data = pickle.load(file)

model = loaded_data['model']
book_names = loaded_data['book_names']
final_rating = loaded_data['final_rating']
book_pivot = loaded_data['book_pivot']

# Function to fetch poster URLs for the recommended books
def fetch_poster(suggestion):
    book_names = []
    ids_index = []
    poster_url = []

    # Fetch book names from the suggestion
    for book_id in suggestion:
        book_names.append(book_pivot.index[book_id])

    # Find the image URLs for the recommended books
    for name in book_names[0]: 
        ids = np.where(final_rating['title'] == name)[0][0]
        ids_index.append(ids)

    for idx in ids_index:
        url = final_rating.iloc[idx]['Image-URL-L']
        poster_url.append(url)

    return poster_url

# Function to recommend books based on the input book name
def recommend_book(book_name):
    books_list = []

    # Check if the book exists in the book_pivot DataFrame
    if book_name not in book_pivot.index:
        raise ValueError(f"Book '{book_name}' not found in the database.")

    book_id = np.where(book_pivot.index == book_name)[0][0]
    distance, suggestion = model.kneighbors(book_pivot.iloc[book_id+1,:].values.reshape(1, -1), n_neighbors=6)

    poster_url = fetch_poster(suggestion)
    
    for i in range(len(suggestion)):
        books = book_pivot.index[suggestion[i]]
        for j in books:
            books_list.append(j)

    return books_list, poster_url

# Define the API route
@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        book_name = request.json.get('book_name')

        if not book_name:
            return jsonify({"error": "Book name is required"}), 400

        recommended_books, poster_url = recommend_book(book_name)

        if not recommended_books:
            return jsonify({"error": "No recommendations found for the given book."}), 404

        return jsonify({
            'recommended_books': recommended_books,
            'poster_url': poster_url
        })

    except ValueError as e:
        # Handle book not found error
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        # Handle any unexpected errors
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while processing the request."}), 500

# Running the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5002)
