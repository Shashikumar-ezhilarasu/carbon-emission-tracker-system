import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import json
import sys

def generate_recommendations(emissions_data):
    # Convert emissions data to DataFrame
    df = pd.DataFrame(emissions_data)
    
    # Feature engineering
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['month'] = df['timestamp'].dt.month
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    
    # Group by user and activity type
    user_activity = df.groupby(['userId', 'activityType']).agg({
        'amount': ['sum', 'mean', 'count'],
        'month': 'nunique',
        'day_of_week': 'nunique'
    }).reset_index()
    
    # Flatten column names
    user_activity.columns = ['_'.join(col).strip() for col in user_activity.columns.values]
    
    # Prepare features for clustering
    features = user_activity.select_dtypes(include=[np.number])
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)
    
    # Perform clustering
    kmeans = KMeans(n_clusters=3, random_state=42)
    user_activity['cluster'] = kmeans.fit_predict(scaled_features)
    
    # Generate recommendations based on clusters
    recommendations = []
    
    for _, row in user_activity.iterrows():
        user_id = row['userId_']
        activity_type = row['activityType_']
        cluster = row['cluster']
        total_emissions = row['amount_sum']
        
        # Generate recommendations based on cluster and activity type
        if cluster == 0:  # High emissions cluster
            if activity_type == 'Transportation':
                recommendations.append({
                    'userId': user_id,
                    'category': 'Transportation',
                    'recommendationText': 'Consider using public transportation or carpooling to reduce your transportation emissions.',
                    'impactEstimate': f'Potential reduction: {total_emissions * 0.3:.2f} kg CO₂ per month'
                })
            elif activity_type == 'Energy':
                recommendations.append({
                    'userId': user_id,
                    'category': 'Energy',
                    'recommendationText': 'Switch to energy-efficient appliances and consider renewable energy sources.',
                    'impactEstimate': f'Potential reduction: {total_emissions * 0.25:.2f} kg CO₂ per month'
                })
        elif cluster == 1:  # Medium emissions cluster
            if activity_type == 'Daily Habits':
                recommendations.append({
                    'userId': user_id,
                    'category': 'Daily Habits',
                    'recommendationText': 'Reduce single-use plastics and practice recycling to lower your daily emissions.',
                    'impactEstimate': f'Potential reduction: {total_emissions * 0.2:.2f} kg CO₂ per month'
                })
        else:  # Low emissions cluster
            recommendations.append({
                'userId': user_id,
                'category': 'General',
                'recommendationText': 'Great job on maintaining low emissions! Consider sharing your sustainable practices with others.',
                'impactEstimate': 'Maintain current levels'
            })
    
    return recommendations

if __name__ == '__main__':
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())
    recommendations = generate_recommendations(input_data)
    print(json.dumps(recommendations)) 