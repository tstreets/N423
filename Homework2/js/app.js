import { Weather } from '../js/weather.js';

let api = {
    key: "dfec19faec834729a8c195143201409",
    currentDataURL:``,

    setCurrentDataURL: function() {
        this.currentDataURL = `https://api.weatherapi.com/v1/forecast.json?key=${this.key}&days=3&q=`;
    }

}

globalThis.weather = new Weather();

document.body.onload = (()=> {
    api.setCurrentDataURL();
    showWeatherButtonListener();
});

function showWeatherButtonListener() {
    $(".callout__button").off("click");
    $(".callout__button").click((e)=> {
        e.preventDefault();

        const zipcodeRef = $(".callout__zipcode").val();
        // if(zipcodeRef == weather.zipcode) return;
        const zipcodeValidate = validateZipcode(zipcodeRef);
        
        if(!zipcodeValidate.status)
        {
            showMessage(zipcodeValidate.message);
            hideWeatherInfo();
        } else
        {
            weather.setZipcode(zipcodeRef);
            weather.getCurrentData(api.currentDataURL, showMessage, (valid)=> {
                valid ? populateWeatherInfo() : hideWeatherInfo();
            });

            
        }
    });
}

function validateZipcode(zipcode) {
    if(zipcode.length == 0) 
        return {status: false, message: "Please enter a zipcode."};

    if(zipcode.length < 5) 
        return {status: false, message: "Sorry, we're having trouble finding that zipcode. Please try entering your 5-digit zipcode again."};

    return {
        status: zipcode.split().every((number)=> {
            return !isNaN(number)
        }),
        message: "Sorry, please only enter numbers 0-9."
    }
}

function showMessage(message = "") {
    $(".message").html(message);
}

function hideWeatherInfo() {
    $(".weatheroverview").attr("hidden", "");
    $(".weatherbreakdown").attr("hidden", "");
    $(".weatherforecast").attr("hidden", "");
}

function populateWeatherInfo() {
    populateWeatherOverview();
    populateWeatherBreakdown();
    populateWeatherForecast();
}

function populateWeatherOverview() {
    $(".weatheroverview").removeAttr("hidden");
    $(".weatheroverview").css("display", "flex");

    $(".weatheroverview__location").html(`${weather.location.city}, ${weather.location.state} Weather`);

    $(".weatheroverview__time").html(`${formatLocalTime(weather.localtime)}`);

    $(".weatheroverview__temp").html(`${weather.temp.f}°`);

    $(".weatheroverview__label").html(`${weather.condition.text}`);

    $(".weatheroverview__icon").attr("alt", weather.condition.text);
    $(".weatheroverview__icon").attr("src", weather.condition.icon.replace("64x64","128x128"));

    $(".weatheroverview__hilow").html(`${weather.forecast[0].temp.hi.f}°/${weather.forecast[0].temp.low.f}°`);

}

function populateWeatherBreakdown() {
    $(".weatherbreakdown").removeAttr("hidden");
    $(".weatherbreakdown").css("display", "flex");

    $(".weatherbreakdown__location").html(`Weather Breakdown in ${weather.location.city}, ${weather.location.state}, ${weather.location.country}`);

    $(".weatherbreakdown__feelslike").html(`Feels Like ${weather.feelslike.f}°`);

    $(".weatherbreakdown__sunrise").html(`Sunrise: ${formatLocalTime(weather.forecast[0].sun.rise)}`);
    $(".weatherbreakdown__sunset").html(`Sunrise: ${formatLocalTime(weather.forecast[0].sun.set)}`);

    $(".weatherbreakdown__hilow").html(`${weather.forecast[0].temp.hi.f}° / ${weather.forecast[0].temp.low.f}°`);

    $(".weatherbreakdown__humidity").html(`${weather.humidity}%`);

    $(".weatherbreakdown__cloud").html(`${weather.cloud}%`);

    $(".weatherbreakdown__latlon").html(`${weather.coor.lat}° / ${weather.coor.lon}°`);

    $(".weatherbreakdown__gust").html(`${weather.gust.mph} mph`);

    $(".weatherbreakdown__precip").html(`${weather.precip.in} in`);

    $(".weatherbreakdown__pressure").html(`${weather.pressure.in} in`);

    $(".weatherbreakdown__vis").html(`${weather.vis.miles} miles`);

    $(".weatherbreakdown__winddir").html(`${formatWindDirection(weather.wind.dir)} (${weather.wind.deg}°)`);
    $(".weatherbreakdown__windspeed").html(`${weather.wind.mph} mph`);

}

function populateWeatherForecast() {
    $(".weatherforecast").removeAttr("hidden");
    $(".weatherforecast").css("display", "flex");
    $(".weatherforecast").html(``);

    weather.forecast.forEach((forecast, index)=> {
        let day = (index == 0) ? "Today" : (index == 1) ? "Tommorow" : formatDayOfWeek(forecast.date);
        // let day = formatDayOfWeek(forecast.date);
        $(".weatherforecast").append(`
        <div class="forecast">
            <h4 class="forecast__title">${day}</h4>
            <img class="forecast__icon" alt="${forecast.condition.text}" src="${forecast.condition.icon}">
            <p class="forecast__label">${forecast.condition.text}</p>
            <p class="forecast__hilow">${forecast.temp.hi.f}°/${forecast.temp.low.f}°</p>
        </div>
        `);
    });
}

function formatLocalTime(localtime) {
    localtime.split(" ").forEach((part)=> {
        if(part.split(":").length > 1) localtime = part;
    });

    const hours = parseInt(localtime.split(":")[0]);
    let afternoon = (hours > 12);

    if(afternoon)
    {
        localtime = `${(hours - 12)}:${localtime.split(":")[1]}`;
    } else if(hours == 0)
    {
        localtime = `12:${localtime.split(":")[1]}`;
    }

    if(localtime.split("")[0] == 0)
    {
        localtime = localtime.split("");
        localtime.shift();
        localtime = `${localtime.join("")}`;
    }

    localtime += (hours >= 12) ? ` PM` : ` AM`;

    return localtime;
}

function formatWindDirection(letter) {
    let direction = "";
    switch(letter) {
        case "N":
            direction = "North";
            break;
        case "E":
            direction = "East";
            break;
        case "S":
            direction = "South";
            break;
        case "W":
            direction = "West";
            break;
        default:
            direction = "N/A"
    }
    return direction;
}

function formatDayOfWeek(date) {
    const dateObj = new Date(date);
    const dayNum = dateObj.getDay() + 1;
    let day = date;

    switch(dayNum) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
            break;
    }

    return day;
}