import pickle
import numpy as np  # Make sure numpy is imported
from flask import Flask, render_template, request
import os

app = Flask(__name__)

# Load the data from the pickle file
with open('recommendation_data.pkl', 'rb') as file:
    loaded_data = pickle.load(file)

# Access the individual objects
model = loaded_data['model']
book_names = loaded_data['book_names']
final_rating = loaded_data['final_rating']
book_pivot = loaded_data['book_pivot']

def fetch_poster(suggestion):
    book_names = []
    ids_index = []
    poster_url = []

    for book_id in suggestion:
        book_names.append(book_pivot.index[book_id])

    for name in book_names[0]: 
        ids = np.where(final_rating['title'] == name)[0][0]
        ids_index.append(ids)

    for idx in ids_index:
        url = final_rating.iloc[idx]['Image-URL-L']
        poster_url.append(url)

    return poster_url


def recommend_book(book_names):
    books_list = []
    book_id = np.where(book_pivot.index == book_names)[0][0]
    distance, suggestion = model.kneighbors(book_pivot.iloc[book_id,:].values.reshape(1, -1), n_neighbors=6)

    poster_url = fetch_poster(suggestion)
    
    for i in range(len(suggestion)):
        books = book_pivot.index[suggestion[i]]
        for j in books:
            books_list.append(j)
    return books_list, poster_url


@app.route('/', methods=['GET', 'POST'])
def index():
    recommended_books = None
    poster_url = None
    selected_books = None
    if request.method == 'POST':
        selected_books = request.form.get('book_name')
        if selected_books:
            recommended_books, poster_url = recommend_book(selected_books)

    return render_template('index.html', 
                           book_names=book_names, 
                           recommended_books=recommended_books, 
                           poster_url=poster_url,
                           selected_books=selected_books)  # Pass selected book to the template



if __name__ == '__main__':
    app.run(debug=True, port=5001)
