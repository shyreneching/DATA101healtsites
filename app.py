from flask import Flask, Response
import pandas as pd

app = Flask(__name__)

data_url = 'data/food_consumption.csv'
actual_data_url = 'data/Merged.csv'

# DATA ENDPOINTS
@app.route('/countries')
def get_countries():
    ## TODO: Get the countries and return as a list or JSON to the JS file
    df = pd.read_csv(data_url)
    df.columns = ['country', 'category', 'consumption', 'co2']

    countries = df.country.unique()

    # [{"value": "Philippines", "label": "Philippines"}, ...]
    country_dict = pd.DataFrame(list(zip(countries, countries)),
        columns=['value', 'label']).to_json(orient="records")

    return Response(country_dict, mimetype="application/json")


@app.route('/data')
def get_data():
    data = pd.read_csv(data_url)
    data.columns = ['country', 'category', 'consumption', 'co2']

    data_json = data.to_json(orient="records")
    return Response(data_json, mimetype="application/json")

@app.route('/data/<country>')
def get_country_data(country):
    ## TODO: Get the data filtered by the provided country in the argument
    df = pd.read_csv(data_url)
    df.columns = ['country', 'category', 'consumption', 'co2']
    
    filtered_df = df[df['country'] == country].to_json(orient="records")


    return Response(filtered_df, mimetype="application/json")

@app.route('/bubblechart')
def get_bubble_data():
    df = pd.read_csv(actual_data_url)

    filtered_df = df[['Region', 'Province', 'Total - Grand Total', 'Total Amenities', 'Population']].copy()
    filtered_df.columns = ['region', 'province', 'workers', 'sites', 'population']

    region_df = filtered_df[['region', 'workers', 'sites', 'population']].groupby(['region']).agg('sum').sort_values(by='population', ascending=False)

    return Response(region_df.to_csv(), mimetype="text/csv", headers={"Content-disposition": "attachment; filename=bubbleregion.csv"})

@app.route('/bubblechart/<region>')
def get_bubble_region(region):
    df = pd.read_csv(actual_data_url)

    filtered_df = df[['Region', 'Province', 'Total - Grand Total', 'Total Amenities', 'Population']].copy()
    filtered_df.columns = ['region', 'province', 'workers', 'sites', 'population']

    filtered_df = filtered_df[filtered_df['region'] == region].sort_values(by='population', ascending=False)

    return Response(filtered_df.to_csv(), mimetype="text/csv", headers={"Content-disposition": "attachment; filename=bubble.csv"})

@app.route('/pie')
def get_pie_sites_data():
    df = pd.read_csv(actual_data_url)

    filtered_df = df[['Region', 'Province', 'clinic', 'dentist', 'doctors', 'healthcare','hospital', 'laboratory','others','pharmacy','social_facility', 'Total Amenities']].copy()
    filtered_df.columns = ['Region', 'Province', 'clinic', 'dentist', 'doctors', 'healthcare','hospital', 'laboratory','others','pharmacy','social_facility', 'Total Amenities']

    filtered_df=filtered_df.append(filtered_df.sum().rename('Total'))
    filtered_df=filtered_df.iloc[-1]

    return Response(filtered_df.to_csv(), mimetype="text/csv")

# STATIC PAGES
@app.route('/about')
def about():
    return app.send_static_file('about.html')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/bubble')
def get_bubble():
    return app.send_static_file('bubble.html')

@app.route('/pie')
def get_pie():
    return app.send_static_file('pie.html')

if __name__ == '__main__':
    app.run(debug=True)
