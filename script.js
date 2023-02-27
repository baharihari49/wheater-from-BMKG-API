
// Mendapatkan Zona Waktu

class time {
    constructor() {
        this.date;
        this.hours;
        this.month;
        this.year;
        this.day;
    }

    getTimeZone() {
        this.date = new Date().getDate()
        this.hours = new Date().getHours().toString()
        this.month = new Date().getMonth()
        this.year = new Date().getFullYear().toString()
        this.day = new Date().getDay() + 1
        return {date: this.date, 
                hours: this.hours, 
                month: this.month, 
                year: this.year,
                days: this.day
            }
    }
}

const timeZone = new time()
const timeNow = timeZone.getTimeZone()



const monthData = timeNow.month + 1
let month;
if(monthData < 10) {
    month = 0 + monthData.toString()
}

let date;
if(timeNow.date < 10) {
    date = 0 + timeNow.date.toString()
}else{
    date = timeNow.date.toString()
}

// Mendapatkan Zona Waktu End








// Mendapatkan lokasi dari user

class Geolocation {
    constructor() {
      this.latitude = 0;
      this.longitude = 0;
    }
  
    async getCurrentPosition() {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        return { latitude: this.latitude, longitude: this.longitude };
    }
}

const myGeo = new Geolocation();
const coordinates = await myGeo.getCurrentPosition();

// Mendapatkan lokasi dari user End








// konversi latitude dan longitude menjadi data kabupaten & provinsi

class getLocationFormUser {
    constructor(latitude,longitude) {
        this.latitude = latitude,
        this.longitude = longitude
        this.provinsi = '';
        this.kabupaten = '';
    }

    async convertCoordinates() {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${this.latitude},${this.longitude}&key=734c808950634f7481c676bd9bb135e1`)
        const data = await response.json()
        this.kabupaten = data.results[0].components.city;
        this.provinsi = this.provinsi = data.results[0].components.state.replace(/\s+/g, "");
        return {provinsi: this.provinsi, kabupaten: this.kabupaten}
    }
}

const location = new getLocationFormUser(coordinates.latitude, coordinates.longitude)

const locationNow = await location.convertCoordinates()
let resultDeletKota;

if(locationNow.kabupaten.substring(0,4) == 'Kota') {
    resultDeletKota = locationNow.kabupaten.substring(5)
}


// konversi latitude dan longitude menjadi data kabupaten End







// fetching API dari bmkg



class getBMKGAPI {
    constructor(provinsi) {
        this.provins = provinsi
        this.items;
    }

    async bmkgApi() {
        const response = await fetch(`https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-${this.provins}.xml`)
        const data = await response.text()
        const parser = new DOMParser()
        const xml = parser.parseFromString(data, 'text/xml');
        this.items = xml.querySelector('data')
        return {items: this.items}

    }
}

const data = new getBMKGAPI(locationNow.provinsi)
const resultBmkgApi = await data.bmkgApi()


// fetching API dari bmkg End






// olah data


const tipeCuaca = {
    0: 'Cerah',
    1: 'Cerah Berawan',
    2: 'Cerah Berawan',
    3: 'Berawan',
    4: 'Berawan Tebal',
    5: 'Udara Kabur',
    10: 'Asap',
    45: 'Berkabut',
    60: 'Hujan Ringan',
    61: 'Hujan Sedang',
    63: 'Hujan Lebat',
    80: 'Hujan Lokal',
    95: 'Hujan Petir',
    97: 'Hujan Petir'
}

const jenisCuaca = (data, result) => {
    let codeWeather1 = [0,1,2,3,4,5,10,45]
    let codeWeather2 = [60,61,63,80,95,97]

    codeWeather1.forEach(d => {
        if(d == data){
            let hasil = './assets/awan_cerah.svg'
            result(hasil) 
        }
    })

    codeWeather2.forEach(d => {
        if(d == data){
            let hasil = './assets/awan_gelap.svg'
            result(hasil) 
        }
    })
}

const temperatur = document.getElementById('temp')
const region = document.getElementById('region')
const tempDaerah = document.querySelector('.wd')
const cuacaDaerah = document.querySelectorAll('.cuacaDaerah')
const infoHome = document.getElementById('infoHome')

console.log(infoHome.childNodes[7].childNodes[5].childNodes[3].childNodes[1].textContent)

const getInfoDaerah = (callback) => {
    cuacaDaerah.forEach( d => {
        callback(d)
    })
}

const getAreBmkgApi = (index) => {
    return resultBmkgApi.items.childNodes[1].childNodes[index]
}

const getTimeNow = (h) => {
    if (h >= 0 && h <= 6) {
        return '00'
    } else if(h < 12) {
        return '06'
    } else if(h < 18) { 
        return '12'
    } else if(h >= 18) { 
        return '18'
    }
} 



const outputOlahData = (callbackDate, callbackTempt, callbackWeather) => {
    for(let i = 0; i < 36; i++) {
        const area = getAreBmkgApi(i).childNodes[3]
        async function getArea() {
            try {
                const result = area.textContent.substring(5)
                return result
                
            }catch(error) {
                
            }
        }
        
        getArea().then(result => {
           if(result == resultDeletKota) {
                const checkTime = getAreBmkgApi(i).childNodes[15].childNodes
                const weather = getAreBmkgApi(i).childNodes[17].childNodes

                const temperaturMin = getAreBmkgApi(i).childNodes[13].childNodes
                const temperaturMax = getAreBmkgApi(i).childNodes[9].childNodes

                const humudity = getAreBmkgApi(i).childNodes[5].childNodes

                const humin = getAreBmkgApi(i).childNodes[11].childNodes

                const humax = getAreBmkgApi(i).childNodes[7].childNodes


                const tempMin = (result) => {
                    for(let i = 0; i < temperaturMin.length; i++){
                        if(i % 2 != 0) {
                            const timeTempMin = temperaturMin[i].attributes[1].textContent.substring(6)

                            if(timeTempMin == timeNow.date){
                                result(temperaturMin[i].childNodes[1].textContent)
                            }
                        }
                    }
                }

                const tempMax = (result) => {
                    for(let i = 0; i < temperaturMin.length; i++){
                        if(i % 2 != 0) {
                            const timeTempMax = temperaturMax[i].attributes[1].textContent.substring(6)

                            if(timeTempMax == timeNow.date){
                                result(temperaturMax[i].childNodes[1].textContent)
                            }
                        }
                    }
                }

                const humudityMin = (result) => {
                    for(let i = 0; i < humin.length; i++){
                        if(i % 2 != 0){
                           const timeHumin = humin[i].attributes[1].textContent.substring(6)
                            
                           if(timeHumin == timeNow.date){
                            result(humin[i].childNodes[1].textContent)
                           }
                        }
                    }
                }
                const humudityMax = (result) => {
                    for(let i = 0; i < humax.length; i++){
                        if(i % 2 != 0){
                           const timeHumax = humax[i].attributes[1].textContent.substring(6)
                            
                           if(timeHumax == timeNow.date){
                            result(humax[i].childNodes[1].textContent)
                           }
                        }
                    }
                }

               

                let checkTime2
                let checkTime3

                let checkTime4
                let checkTime5 = []
                let checktime6 = []

                for(let j = 1; j <= 6; j++){
                    if(j == 1) {
                        checkTime3 = getAreBmkgApi(i + j)
                        checkTime2 = checkTime3.childNodes[15].childNodes
                    }else if(j > 1){
                        checkTime4 = getAreBmkgApi(i + j)
                        checkTime5.push(checkTime4.childNodes[15].childNodes)
                        checktime6.push(checkTime4)
                    }
                }
                

                // console.log(checkTime3.childNodes[17].childNodes)


                for(let i = 0; i < checkTime.length; i++) {
                    if(i % 2 != 0) {
                        const timeDataFormApi = checkTime[i].attributes.datetime.value.substring(8,10)
                        const dateFormApi = checkTime[i].attributes.datetime.value.substring(6,8)
                        const monthFormApi = checkTime[i].attributes.datetime.value.substring(4,6)
                        const yearFormApi = checkTime[i].attributes.datetime.value.substring(0,4)

                        callbackTempt(checkTime[i].childNodes[1].textContent)

                        

                        if(i == 1) {
                            let dateDate = [
                                checkTime[1].attributes.datetime.value.substring(6,8),
                                checkTime[9].attributes.datetime.value.substring(6,8),
                                checkTime[17].attributes.datetime.value.substring(6,8)
                            ]
                            let weatherDate = [
                                weather[1].childNodes[1].textContent,
                                weather[9].childNodes[1].textContent,
                                weather[17].childNodes[1].textContent,
                            ]
                            callbackDate(dateDate)
                            callbackWeather(weatherDate)

                        }

                        const getDate = (y,m,d,h) => {
                            if (y == yearFormApi && m == monthFormApi && d == dateFormApi && h == timeDataFormApi) {
                                temperatur.innerHTML = checkTime[i].childNodes[1].textContent
                                region.innerHTML = result

                                console.log(humudity[i].childNodes[1].textContent)


                                // daerah sekitar
                                tempDaerah.childNodes[3].childNodes[0].textContent = checkTime3.childNodes[3].textContent
                                tempDaerah.childNodes[1].childNodes[3].childNodes[1].textContent = checkTime2[i].childNodes[1].textContent
                                tempDaerah.childNodes[5].childNodes[1].childNodes[0].childNodes[3].textContent = checkTime3.childNodes[5].childNodes[i].childNodes[1].textContent + '%'
                                tempDaerah.childNodes[5].childNodes[1].childNodes[2].childNodes[3].textContent = checkTime3.childNodes[21].childNodes[i].childNodes[1].textContent + 'k'
                                const kodeCuaca = checkTime3.childNodes[17].childNodes[i].childNodes[1].textContent

                                jenisCuaca(kodeCuaca, result => {
                                    tempDaerah.childNodes[1].childNodes[1].attributes[1].textContent = result
                                })

                                for(let d = 0; d < cuacaDaerah.length; d++){
                                    // temperatur
                                    cuacaDaerah[d].childNodes[1].childNodes[3].childNodes[1].childNodes[1].textContent = checkTime5[d][i].childNodes[1].textContent

                                    // daerah
                                    function resultKota(data){
                                        if(data.substring(0,4) == 'Kota'){
                                            return data.substring(5)
                                        }else if(data.substring(0,3) == 'Kab'){
                                            return data.substring(5)
                                        }
                                    }

                                    cuacaDaerah[d].childNodes[3].childNodes[0].textContent = resultKota(checktime6[d].childNodes[3].textContent)

                                    jenisCuaca(kodeCuaca, result => {
                                        cuacaDaerah[d].childNodes[1].childNodes[1].attributes[0].textContent = result
                                    })


                                    // bagian infoHome


                                    // const checkTimeTempMin =  temperaturMin[i].attributes[1].textContent


                                    infoHome.childNodes[3].textContent = tipeCuaca[kodeCuaca]

                                    jenisCuaca(kodeCuaca, result => {
                                        infoHome.childNodes[1].attributes[1].textContent = result
                                    })

                                    // temperatur

                                    infoHome.childNodes[5].childNodes[1].childNodes[3].childNodes[1].textContent = checkTime[i].childNodes[1].textContent

                                    // temperatur Min

                                    tempMin(result => {
                                        infoHome.childNodes[5].childNodes[3].childNodes[3].childNodes[1].textContent = result
                                    })


                                    // temperatur max

                                    tempMax(result => {
                                        infoHome.childNodes[5].childNodes[5].childNodes[3].childNodes[1].textContent = result
                                    })

                                    // kelembapan
                                    infoHome.childNodes[7].childNodes[1].childNodes[3].childNodes[1].textContent = humudity[i].childNodes[1].textContent

                                    humudityMin(result => {
                                        infoHome.childNodes[7].childNodes[3].childNodes[3].childNodes[1].textContent = result
                                    })

                                    humudityMax(result => {
                                        infoHome.childNodes[7].childNodes[5].childNodes[3].childNodes[1].textContent = result
                                    })

                                }

                            }
                        }
    
                        getDate(timeNow.year,month, timeNow.date, getTimeNow(timeNow.hours))
                    }
                }
                
           }
        })
    }
}


// console.log(tempt)


// olah data End


// Buat Grafik


    // Dapatkan info Hari



    const days = (d) => {
        if(d == 1){
            return 'Minggu'
        }else if(d == 2) {
            return 'Senin'
        }else if(d == 3) {
            return 'Selasa'
        }else if(d == 4) {
            return 'Rabu'
        }else if(d == 5) {
            return 'Kamis'
        }else if(d == 6) {
            return 'Jumat'
        }else if(d == 0) {
            return 'Sabtu'
        }
    }
    


    // Dapatkan info Hari End


    // Gambar Grafik


    class canvas{
        constructor(days1, days2, days3, temp1, temp2, temp3, weather1, weather2, weather3) {
            this.days1 = days1
            this.days2 = days2
            this.days3 = days3
            this.temp1 = temp1
            this.temp2 = temp2
            this.temp3 = temp3
            this.weather1 = weather1
            this.weather2 = weather2
            this.weather3 = weather3
            this.resultWeather1 = 
            this.resultWeather2;
            this.resultWeather3;
        }

        logicChart1() {
            if(this.temp1 == 20){
                return 120
            }else if (this.temp1 == 21){
                return 115
            }else if(this.temp1 == 22){
                return 110
            }else if(this.temp1 == 23){
                return 105
            }else if(this.temp1 == 24){
                return 100
            }else if (this.temp1 == 25){
                return 95
            }else if(this.temp1 == 26){
                return 90
            }else if(this.tempt1 == 27){
                return 85
            }else if(this.temp1 == 28){
                return 80
            }else if(this.temp1 == 29){
                return 75
            }else if(this.temp1 == 30){
                return 70
            }else if(this.temp1 == 31){
                return 65
            }else if(this.temp1 == 32){
                return 60
            }else if(this.temp1 == 33){
                return 55
            }else if(this.temp1 == 34){
                return 50
            }else if(this.temp1 == 35){
                return 45
            }else if(this.temp1 == 36){
                return 40
            }else if(this.temp1 == 37){
                return 35
            }else if(this.temp1 == 38){
                return 30
            }else if(this.temp1 == 39){
                return 25
            }else if(this.temp1 == 40){
                return 20
            }
        }
        logicChart2() {
            if(this.temp2 == 20){
                return 120
            }else if (this.temp2 == 21){
                return 115
            }else if(this.temp2 == 22){
                return 110
            }else if(this.temp2 == 23){
                return 105
            }else if(this.temp2 == 24){
                return 100
            }else if (this.temp2 == 25){
                return 95
            }else if(this.temp2 == 26){
                return 90
            }else if(this.tempt2 == 27){
                return 85
            }else if(this.temp2 == 28){
                return 80
            }else if(this.temp2 == 29){
                return 75
            }else if(this.temp2 == 30){
                return 70
            }else if(this.temp2 == 31){
                return 65
            }else if(this.temp2 == 32){
                return 60
            }else if(this.temp2 == 33){
                return 55
            }else if(this.temp2 == 34){
                return 50
            }else if(this.temp2 == 35){
                return 45
            }else if(this.temp2 == 36){
                return 40
            }else if(this.temp2 == 37){
                return 35
            }else if(this.temp2 == 38){
                return 30
            }else if(this.temp2 == 39){
                return 25
            }else if(this.temp2 == 40){
                return 20
            }
        }
        logicChart3() {
            if(this.temp3 == 20){
                return 120
            }else if (this.temp3 == 21){
                return 115
            }else if(this.temp3 == 22){
                return 110
            }else if(this.temp3 == 23){
                return 105
            }else if(this.temp3 == 24){
                return 100
            }else if (this.temp3 == 25){
                return 95
            }else if(this.temp3 == 26){
                return 90
            }else if(this.tempt3 == 27){
                return 85
            }else if(this.temp3 == 28){
                return 80
            }else if(this.temp3 == 29){
                return 75
            }else if(this.temp3 == 30){
                return 70
            }else if(this.temp3 == 31){
                return 65
            }else if(this.temp3 == 32){
                return 60
            }else if(this.temp3 == 33){
                return 55
            }else if(this.temp3 == 34){
                return 50
            }else if(this.temp3 == 35){
                return 45
            }else if(this.temp3 == 36){
                return 40
            }else if(this.temp3 == 37){
                return 35
            }else if(this.temp3 == 38){
                return 30
            }else if(this.temp3 == 39){
                return 25
            }else if(this.temp3 == 40){
                return 20
            }
        }

        logicWeather1() {
            let codeWeather1 = [0,1,2,3,4,5,10,45]
            let codeWeather2 = [60,61,63,80,95,97]
            
            codeWeather1.forEach(cw => {
                if(this.weather1 == cw) {
                   this.resultWeather1 = 'awan_cerah.svg'
                }
            })
            codeWeather2.forEach(cw => {
                if(this.weather1 == cw) {
                    this.resultWeather1 = 'awan_gelap.svg'
                }
            })
            return this.resultWeather1

        }
        logicWeather2() {
            let codeWeather1 = [0,1,2,3,4,5,10,45]
            let codeWeather2 = [60,61,63,80,95,97]
            
            codeWeather1.forEach(cw => {
                if(this.weather2 == cw) {
                    this.resultWeather1 = 'awan_cerah.svg'
                }
            })
            codeWeather2.forEach(cw => {
                if(this.weather2 == cw) {
                    this.resultWeather1 = 'awan_gelap.svg'
                }
            })
            return this.resultWeather1

        }
        logicWeather3() {
            let codeWeather1 = [0,1,2,3,4,5,10,45]
            let codeWeather2 = [60,61,63,80,95,97]
            
            codeWeather1.forEach(cw => {
                if(this.weather3 == cw) {
                    this.resultWeather1 = 'awan_cerah.svg'
                }
            })
            codeWeather2.forEach(cw => {
                if(this.weather3 == cw) {
                    this.resultWeather1 = 'awan_gelap.svg'
                }
            })
            return this.resultWeather1

        }
    
        makeCanvas() {
            const myCanvas = document.getElementById('myCanvas')
    
            const ctx = myCanvas.getContext("2d")

            // Membuat Garis

            ctx.beginPath()
            ctx.lineWidth = '2'
            ctx.strokeStyle = "#FBB454"
            ctx.moveTo(20,this.logicChart1())
            ctx.lineTo(150,this.logicChart2())
            ctx.lineTo(280,this.logicChart3())

            ctx.stroke()
            ctx.strokeStyle = "#FBB454";
            
            ctx.strokeStyle = "#FBB454";
    
            const grd = ctx.createLinearGradient(0, 0, 0, 150);
            grd.addColorStop(0, "#FBB454");
            grd.addColorStop(1, "rgba(251, 180, 84, 0)");
    
            ctx.fillStyle = grd;
            ctx.moveTo(20,this.logicChart1())
            ctx.lineTo(150,this.logicChart2())
            ctx.lineTo(280,this.logicChart3())
            ctx.lineTo(280,120)
            ctx.lineTo(20,120)
    
            ctx.fill();
    
            // Membuat Garis Selesai
    
            // Membuat lingkaran
    
            ctx.fillStyle = "#FBB454";
            ctx.beginPath();
            ctx.arc(20,this.logicChart1(),3,0,2*Math.PI);
            ctx.stroke();
            ctx.fill()
    
            ctx.beginPath();
            ctx.arc(150,this.logicChart2(),3,0,2*Math.PI);
            ctx.stroke();
            ctx.fill()
    
            ctx.beginPath();
            ctx.arc(280,this.logicChart3(),3,0,2*Math.PI);
            ctx.stroke();
            ctx.fill()
    
            // Membuat lingkaran Selesai
    
            //  membuat teks
    
            ctx.beginPath()
            ctx.fillStyle = "black";
            ctx.font = "12px Poppins";
            ctx.fillText(this.days1,4,145);
    
            ctx.fillStyle = "black";
            ctx.font = "12px Poppins";
            ctx.fillText(this.days2,130,145);
    
            ctx.fillStyle = "black";
            ctx.font = "12px Poppins";
            ctx.fillText(this.days3,260,145);
    
    
    
            ctx.beginPath()
            ctx.fillStyle = "black";
            ctx.font = "12px Poppins";
            ctx.fillText(this.temp1 + '℃',7,this.logicChart1() - 10);
    
            ctx.fillStyle = "black";
            ctx.font = "12px Poppins";
            ctx.fillText(this.temp2 + '℃',139,this.logicChart2() - 10);
    
            ctx.fillStyle = "black";
            ctx.font = "12px Poppins";
            ctx.fillText(this.temp3 + '℃',269,this.logicChart3() - 10);
        
            //  membuat teks selesai
    
            // membuat gambar
    
            const drawImage = (url ,x ,y) => {
                const image = new Image()
                image.src = url
                const width = 33
                const height = 21
                image.onload = () => {
                    ctx.drawImage(image, x, y, width, height)
                }
            }
    
            drawImage(`./assets/${this.logicWeather1()}`, 3, this.logicChart1() - 50)
    
            drawImage(`./assets/${this.logicWeather2()}`, 134, this.logicChart2() - 50)
    
            drawImage(`./assets/${this.logicWeather3()}`, 269, this.logicChart3() - 50)
    
        }
    }

    
    // Gambar Grafik End

    class resultFinalGetMonth{
        constructor(m){
            this.resultMonth;
            this.resultPrev;
            this.resultGetMonth;
            this.c = m
        }
    
        getMonth() {
            if(this.c == 1) {
                return 'januari'
            }else if(this.c == 2){
                return 'februari'
            }else if(this.c == 3){
                return 'maret'
            }else if(this.c == 4){
                return 'april'
            }else if(this.c == 5){
                return 'mei'
            }else if(this.c == 6){
                return 'juni'
            }else if(this.c == 7){
                return 'juli'
            }else if(this.c == 8){
                return 'agustus'
            }else if(this.c == 9){
                return 'september'
            }else if(this.c == 10){
                return 'oketober'
            }else if(this.c == 11){
                return 'november'
            }else if(this.c == 12){
                return 'desember'
            }
        }
    
        Months() {
    
             if(this.getMonth() == 'januari'){
                    return 31
                }else if(this.getMonth() == 'februari'){
                    return 59
                }else if(this.getMonth() == 'maret'){
                    return 90
                }else if(this.getMonth() == 'april'){
                    return 120
                }else if(this.getMonth() == 'mei'){
                    return 151
                }else if(this.getMonth() == 'juni'){
                    return 181
                }else if(this.getMonth() == 'juli'){
                    return 212
                }else if(this.getMonth() == 'agustus'){
                    return 243
                }else if(this.getMonth() == 'september'){
                    return 273
                }else if(this.getMonth() == 'oktober'){
                    return 304
                }else if(this.getMonth() == 'november'){
                    return 334
                }else if(this.getMonth() == 'desember'){
                    return 365
                }
        }
    
        PrevMonth() {
            if(this.getMonth() == 'januari'){
                return 0
            }else if(this.getMonth() == 'februari'){
                return 31
            }else if(this.getMonth() == 'maret'){
                return 59
            }else if(this.getMonth() == 'april'){
                return 90
            }else if(this.getMonth() == 'mei'){
                return 120
            }else if(this.getMonth() == 'juni'){
                return 151
            }else if(this.getMonth() == 'juli'){
                return 181
            }else if(this.getMonth() == 'agustus'){
                return 212
            }else if(this.getMonth() == 'september'){
                return 243
            }else if(this.getMonth() == 'oktober'){
                return 273
            }else if(this.getMonth() == 'november'){
                return 304
            }else if(this.getMonth() == 'desember'){
                return 334
            }
        }
    }
    
    const logicMonth = (month,date, callback) => {
        let test =  new resultFinalGetMonth(month)
    
       const frameLogicMonth = (a,b,c) => {
        b = b.toString()
        if (b <= 10 || b >= 10){
            b = 0 + b
            b = Number(b)
            let d = b + c
            // console.log(c);
            // console.log(d);
            for(let i = 0; i <= a; i++) {
                if(i == d){
                    let num = i
                    // console.log(num);
                    while (num >= 7) {
                        num -= 7
                    }
                    // console.log(num)
               callback(days(num))
            }
            }
        }
       }
    
       return frameLogicMonth(test.Months(), date, test.PrevMonth())
    
    }
    
    let resultDate = []
    let resultTemp = []
    let resultWeather = []


    outputOlahData(result => {
      result.forEach(res => {
        logicMonth(month, res, hasil => {
            resultDate.push(hasil)
        })
      });
    }, result2 => {
        resultTemp.push(Number(result2))
    },result3 => {
        resultWeather = result3
    })

    // hitung nilai rata rata

    let result = [];
    let sum = 0;
    let count = 0;

   setTimeout(() => {

    for (let i = 0; i <resultTemp.length; i += 4) {
        sum = 0;
        count = 0;
        for (let j = i; j < i + 4; j++) {
                if (j >= resultTemp.length) break;
                sum += resultTemp[j];
                count++;
        }
        result.push(sum / count);
    }

   },1000)

    // hitung nilai rata rata end



    setTimeout(() => {
        const cnvs = new canvas(
            resultDate[0],
            resultDate[1],
            resultDate[2],
            Math.floor( result[0]),
            Math.floor( result[1]),
            Math.floor( result[2]),
            resultWeather[0],
            resultWeather[1],
            resultWeather[3],
        )
        cnvs.makeCanvas()
    },1000)


// Buat Grafik End
