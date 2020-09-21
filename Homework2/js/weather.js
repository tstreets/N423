class Weather {

    constructor(zipcode = 99999) {
        this.zipcode = zipcode;
        this.valid = false;
    }

    getCurrentData(baseUrl, callbackMessage, callback) {
        const fullUrl = baseUrl + this.zipcode;
        $.getJSON(fullUrl, data=> {
            this.storeCurrentData(data);
            this.valid = true;
            callbackMessage();

            callback(this.valid);
            
        }).catch(error=> {
            const responseText = JSON.parse(error.responseText).error;
            this.valid = false;
            callback(this.valid);
    
            switch(responseText.code) {
                case 1003:
                    callbackMessage("The zipcode field is empty.")
                    break;
                case 1006:
                    callbackMessage("Sorry, we're having trouble finding that zipcode. Please try entering your 5-digit zipcode again.");
                    break;
                default:
                    callbackMessage(`Sory, an unexpected error occured. Error Code: ${responseText.code}`);
            }
        });
    }

    storeCurrentData(data) {

        this.cloud = data.current.cloud;
        this.condition = {
            text: data.current.condition.text, 
            icon: data.current.condition.icon
        };
        this.coor = {
            lat: data.location.lat, 
            lon: data.location.lon
        };

        this.feelslike = {
            c: data.current.feelslike_c, 
            f: data.current.feelslike_f
        };

        this.gust = {
            mph: data.current.gust_mph, 
            kph: data.current.gust_kph
        };

        this.humidity = data.current.humidity;

        this.isday = data.current.is_day;

        this.localtime = data.location.localtime;
        this.location = {
            city: data.location.name, 
            state: data.location.region, 
            country: data.location.country
        }

        this.precip = {
            mm: data.current.precip_mm, 
            in: data.current.precip_in
        };
        this.pressure = {
            in: data.current.pressure_in, 
            mb: data.current.pressure_mb
        };

        this.temp = {
            c: data.current.temp_c, 
            f: data.current.temp_f
        };

        this.uv = data.current.uv;

        this.vis = {
            km: data.current.vis_km, 
            miles: data.current.vis_miles
        }

        this.wind = {
            mph: data.current.wind_mph, 
            kph: data.current.wind_kph, 
            dir: data.current.wind_dir, 
            deg: data.current.wind_degree
        };

        this.storeForecastData(data.forecast.forecastday);
    }

    storeForecastData(data) {
        this.forecast = [];
        data.forEach((day, index)=>{
            this.forecast.push({
                date: day.date,
                sun: {
                    set: day.astro.sunset,
                    rise: day.astro.sunrise
                },

                temp: {
                    hi: {
                        c: day.day.maxtemp_c,
                        f: day.day.maxtemp_f,
                    },
                    low: {
                        c: day.day.mintemp_c,
                        f: day.day.mintemp_f,
                    }
                },

                precip: {
                    in: day.day.totalprecip_in,
                    mm: day.day.totalprecip_mm
                },

                wind: {
                    kph: day.day.maxwind_kph,
                    mph: day.day.maxwind_mph
                },

                vis: {
                    miles: day.day.avgvis_miles,
                    km: day.day.avgvis_km,
                },

                rain: day.day.daily_will_it_rain,
                snow: day.day.daily_will_it_snow,

                condition: {
                    text: day.day.condition.text, 
                    icon: day.day.condition.icon
                }
                
            });
        });
    }

    setZipcode(zipcode) {
        this.zipcode = zipcode;
    }
}

export { Weather };