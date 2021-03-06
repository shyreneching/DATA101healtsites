from flask import Flask, Response
import pandas as pd
import json

app = Flask(__name__)

actual_data_url = 'data/Merged.csv'

# DATA ENDPOINTS
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

@app.route('/piesitesdata')
def get_pie_sites_data():
    df = pd.read_csv(actual_data_url)

    filtered_df = df[['clinic', 'dentist', 'doctors', 'healthcare','hospital', 'laboratory','pharmacy','social facility','others']].copy()
    filtered_df.columns = ['clinic', 'dentist', 'doctors', 'healthcare','hospital', 'laboratory','pharmacy','social facility','others']

    filtered_df=filtered_df.append(filtered_df.sum().rename('total'))
    filtered_df=filtered_df.iloc[-1].sort_values(ascending=False)

    # return Response(filtered_df.to_json(), mimetype="application/json")
    return Response(filtered_df.to_csv(), mimetype="text/csv", headers={"Content-disposition": "attachment; filename=piesites.csv"})

@app.route('/piesitesdata/<worker>/<sector>/<amenity>/<location>')
def get_pie_sites_data_filtered(worker, sector, amenity, location):
    df = pd.read_csv(actual_data_url)

    arr = ['clinic', 'dentist', 'doctors', 'healthcare','hospital', 'laboratory','pharmacy','social facility','others']

    if amenity != "null" and amenity != "ALL":
        arr = [amenity]

    filtered_df = df[['Region', 'Province'] + arr.copy()].copy()
    filtered_df.columns = ['region', 'province'] + arr.copy()

    if location != "null" and location != "ALL":
        if location.startswith('region_'):
            location = location[7:]
            print(location)
            filtered_df = filtered_df[filtered_df['region'] == location]
        else:
            filtered_df = filtered_df[filtered_df['province'] == location]

    filtered_df=filtered_df[arr].copy()
    filtered_df.columns = arr.copy()
    filtered_df=filtered_df.append(filtered_df.sum().rename('total'))
    filtered_df=filtered_df.iloc[-1].sort_values(ascending=False)

    # return Response(filtered_df.to_json(), mimetype="application/json")
    return Response(filtered_df.to_csv(), mimetype="text/csv", headers={"Content-disposition": "attachment; filename=piesites.csv"})

@app.route('/pieworkersdata')
def get_pie_workers_data():
    df = pd.read_csv(actual_data_url)

    filtered_df = df[['Total - Dentist', 'Total - Doctor - Clinical', 'Total - Medical Technologist', 'Total - Midwife','Total - Nurse', 'Total - Nutritionist or Dietician','Total - Occupational Therapist','Total - Pharmacist','Total - Physical Therapist','Total - Radiologic Technologist','Total - X-ray Technologist']].copy()
    filtered_df.columns = ['dentist', 'doctor - clinical', 'medical technologist', 'midwife','nurse', 'nutritionist or dietician','occupational therapist','pharmacist','physical therapist','radiologic technologist', 'x-ray technologist']

    filtered_df=filtered_df.append(filtered_df.sum().rename('total'))
    filtered_df=filtered_df.iloc[-1].sort_values(ascending=False)

    # return Response(filtered_df.to_json(), mimetype="application/json")
    return Response(filtered_df.to_csv(), mimetype="text/csv", headers={"Content-disposition": "attachment; filename=piesites.csv"})

@app.route('/pieworkersdata/<worker>/<sector>/<amenity>/<location>')
def get_pie_workers_data_filtered(worker, sector, amenity, location):
    df = pd.read_csv(actual_data_url)

    arr = ['Dentist', 'Doctor - Clinical', 'Medical Technologist', 'Midwife','Nurse', 'Nutritionist or Dietician','Occupational Therapist','Pharmacist','Physical Therapist','Radiologic Technologist','X-ray Technologist']

    if worker != "null" and worker != "ALL":
        arr = [worker]

    filtered_df = df[['Region', 'Province'] + list(map(lambda x: sector + " - " + x, arr))].copy()
    filtered_df.columns = ['region', 'province'] + arr.copy()

    if location != "null" and location != "ALL":
        if location.startswith('region_'):
            location = location[7:]
            print(location)
            filtered_df = filtered_df[filtered_df['region'] == location]
        else:
            filtered_df = filtered_df[filtered_df['province'] == location]

    filtered_df=filtered_df[arr].copy()
    filtered_df.columns = arr.copy()
    filtered_df=filtered_df.append(filtered_df.sum().rename('total'))
    filtered_df=filtered_df.iloc[-1].sort_values(ascending=False)

    # return Response(filtered_df.to_json(), mimetype="application/json")
    return Response(filtered_df.to_csv(), mimetype="text/csv", headers={"Content-disposition": "attachment; filename=piesites.csv"})

@app.route('/numworkers')
def get_number_workers():
    df = pd.read_csv(actual_data_url)

    filtered_df = df[['Total - Dentist', 'Total - Doctor - Clinical', 'Total - Medical Technologist', 'Total - Midwife','Total - Nurse', 'Total - Nutritionist or Dietician','Total - Occupational Therapist','Total - Pharmacist','Total - Physical Therapist','Total - Radiologic Technologist','Total - X-ray Technologist']].copy()
    filtered_df.columns = ['dentist', 'doctor - clinical', 'medical technologist', 'midwife','nurse', 'nutritionist or dietician','occupational therapist','pharmacist','physical therapist','radiologic technologist', 'x-ray technologist']

    filtered_df=filtered_df.append(filtered_df.sum().rename('total'))
    filtered_df=filtered_df.iloc[[-1]]

    # return Response(filtered_df.to_json(), mimetype="application/json")
    return Response(filtered_df.sum(axis=1).to_csv(), mimetype="text/csv", headers={"Content-disposition": "attachment; filename=numworkers.csv"})

@app.route('/numworkers/<worker>/<sector>/<amenity>/<location>')
def get_number_workers_filtered(worker, sector, amenity, location):
    df = pd.read_csv(actual_data_url)

    arr = ['Dentist', 'Doctor - Clinical', 'Medical Technologist', 'Midwife','Nurse', 'Nutritionist or Dietician','Occupational Therapist','Pharmacist','Physical Therapist','Radiologic Technologist','X-ray Technologist']

    if worker != "null" and worker != "ALL":
        arr = [worker]

    filtered_df = df[['Region', 'Province'] + list(map(lambda x: sector + " - " + x, arr))].copy()
    filtered_df.columns = ['region', 'province'] + arr.copy()

    if location != "null" and location != "ALL":
        if location.startswith('region_'):
            location = location[7:]
            print(location)
            filtered_df = filtered_df[filtered_df['region'] == location]
        else:
            filtered_df = filtered_df[filtered_df['province'] == location]

    filtered_df=filtered_df[arr].copy()
    filtered_df.columns = arr.copy()
    filtered_df=filtered_df.append(filtered_df.sum().rename('total'))
    filtered_df=filtered_df.iloc[[-1]]

    # return Response(filtered_df.to_json(), mimetype="application/json")
    return Response(filtered_df.sum(axis=1).to_csv(), mimetype="text/csv", headers={"Content-disposition": "attachment; filename=numworkers.csv"})

@app.route('/numsites')
def get_number_sites():
    df = pd.read_csv(actual_data_url)

    filtered_df = df[['clinic', 'dentist', 'doctors', 'healthcare','hospital', 'laboratory','pharmacy','social facility','others']].copy()
    filtered_df.columns = ['clinic', 'dentist', 'doctors', 'healthcare','hospital', 'laboratory','pharmacy','social facility','others']

    filtered_df=filtered_df.append(filtered_df.sum().rename('total'))
    filtered_df=filtered_df.iloc[[-1]]

    # return Response(filtered_df.to_json(), mimetype="application/json")
    return Response(filtered_df.sum(axis=1).to_csv(), mimetype="text/csv", headers={"Content-disposition": "attachment; filename=numsites.csv"})

@app.route('/numsites/<worker>/<sector>/<amenity>/<location>')
def get_number_sites_filtered(worker, sector, amenity, location):
    df = pd.read_csv(actual_data_url)

    arr = ['clinic', 'dentist', 'doctors', 'healthcare','hospital', 'laboratory','pharmacy','social facility','others']

    if amenity != "null" and amenity != "ALL":
        arr = [amenity]

    filtered_df = df[['Region', 'Province'] + arr.copy()].copy()
    filtered_df.columns = ['region', 'province'] + arr.copy()

    if location != "null" and location != "ALL":
        if location.startswith('region_'):
            location = location[7:]
            print(location)
            filtered_df = filtered_df[filtered_df['region'] == location]
        else:
            filtered_df = filtered_df[filtered_df['province'] == location]

    filtered_df=filtered_df[arr].copy()
    filtered_df.columns = arr.copy()
    filtered_df=filtered_df.append(filtered_df.sum().rename('total'))
    filtered_df=filtered_df.iloc[[-1]]

    # return Response(filtered_df.to_json(), mimetype="application/json")
    return Response(filtered_df.sum(axis=1).to_csv(), mimetype="text/csv", headers={"Content-disposition": "attachment; filename=numsites.csv"})

@app.route('/hierarchicaldata')
def get_hierarchical_regional_data():
    df = pd.read_csv(actual_data_url)
    
    filtered_df = df[['Region', 
        'Province', 
        'pharmacy', 
        'clinic', 
        'hospital', 
        'dentist', 
        'doctors', 
        'laboratory', 
        'social facility', 
        'healthcare']].copy()

    regions = filtered_df['Region'].unique()
    hierarchical_data = {"name": "hierarchical", "children": []}

    # for each region
    for region in regions:
        region_provinces = filtered_df.loc[df['Region'] == region]['Province'].unique()
        r_level = {"name": region, "children": []}

        for province in region_provinces:
            p_level = {"name": province, "children": []}

            province_ammenties = ['pharmacy', 'clinic', 'hospital', 'dentist', 'doctors', 'laboratory', 'social facility', 'healthcare']
            for amenity in province_ammenties:
                a_list = filtered_df.loc[df['Province'] == province][amenity].to_list()
                a_value = a_list[0]
                p_level["children"].append({"name": amenity, "value": a_value})

            r_level["children"].append(p_level)
        hierarchical_data["children"].append(r_level)
    
    json_string = json.dumps(hierarchical_data)
    return Response(json_string, mimetype="text/json", headers={"Content-disposition": "attachment; filename=hierarchical.json"})

# STATIC PAGES

@app.route('/')
def index():
    return app.send_static_file('index.html')

# @app.route('/bubble')
# def get_bubble():
#     return app.send_static_file('bubble.html')

# @app.route('/piesites')
# def get_pie_sites():
#     return app.send_static_file('piesites.html')

# @app.route('/pieworkers')
# def get_pie_workers():
#     return app.send_static_file('pieworkers.html')

@app.route('/hierarchical')
def get_hierarchical_bar():
    return app.send_static_file('hierarchical.html')

if __name__ == '__main__':
    app.run(debug=True)
    
