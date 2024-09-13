from flask import Flask, request, jsonify
import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Load movies data and convert it to a DataFrame
movies_dict = pickle.load(open('Movies_dict.pkl', 'rb'))  # Load movies from the pickle file
new_df = pd.DataFrame(movies_dict)  # Convert the dictionary back to a DataFrame

# Load similarity matrix
similarity = pickle.load(open('similarity.pkl', 'rb'))

@app.route('/movies', methods=['GET'])
def get_movies():
    # Send the list of all movie titles to the frontend
    return jsonify(new_df['title'].tolist())


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    movie = data['movie']
    
    # Check if the movie is in the loaded movies list
    if movie not in new_df['title'].values:
        return jsonify({'error': 'Movie not found'})

    # Get index of the movie and calculate similarity
    movie_index = new_df[new_df['title'] == movie].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    
    # Return the top 5 recommended movies
    recommended_movies = [new_df.iloc[i[0]].title for i in movies_list]
    return jsonify(recommended_movies)

if __name__ == '__main__':
    app.run(debug=True)
