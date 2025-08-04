import yfinance as yf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from django.shortcuts import render
import io
import base64
import pytz

def fetch_stock_data(ticker):
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period='5y')
        
        # Check if data is empty
        if df is None or df.empty:
            raise ValueError(f"Error: No stock data found for '{ticker}'. Check the ticker symbol.")

        # Convert index to datetime and ensure timezone handling
        df = df.reset_index()
        df['Date'] = pd.to_datetime(df['Date'])
        
        # Ensure datetime is timezone-aware
        if df['Date'].dt.tz is None:
            df['Date'] = df['Date'].dt.tz_localize('UTC')
        else:
            df['Date'] = df['Date'].dt.tz_convert('UTC')

        return df

    except Exception as e:
        raise ValueError(f"Error fetching stock data: {str(e)}")

def train_model(df):
    df['Days'] = (df['Date'] - df['Date'].min()).dt.days
    X = df[['Days']]
    y = df['Close']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)
    return model

def predict_price(model, days):
    return model.predict(np.array([[days]], dtype=np.float64))[0]  # Ensure correct input format

def stock_prediction_view(request):
    prediction = None
    chart_url = None
    
    if request.method == 'POST':
        ticker = request.POST.get('ticker', '').strip().upper()  # Ensure input is valid
        
        try:
            df = fetch_stock_data(ticker)
            model = train_model(df)
            
            # Get today's date in UTC
            today = pd.Timestamp.now(tz=pytz.UTC)
            future_days = (today - df['Date'].min()).days + 30
            prediction = predict_price(model, future_days)
            
            # Generate graph
            plt.figure(figsize=(12, 6))
            plt.plot(df['Date'], df['Close'], label='Actual Prices', color='blue')
            plt.axvline(x=today, color='red', linestyle='--', label='Today')
            plt.scatter(today + pd.Timedelta(days=30), prediction, color='green', label='Prediction', s=100)
            
            plt.xlabel('Date', fontsize=12, fontweight='bold')
            plt.ylabel('Stock Price', fontsize=12, fontweight='bold')
            plt.title(f'Stock Price Prediction for {ticker}', fontsize=14, fontweight='bold', color='darkblue')
            plt.legend()
            plt.grid()
            
            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            chart_url = base64.b64encode(buf.getvalue()).decode('utf-8')
            buf.close()
        
        except ValueError as e:
            return render(request, 'stock_prediction.html', {'error': str(e)})

    return render(request, 'stock_prediction.html', {'prediction': prediction, 'chart_url': chart_url})
