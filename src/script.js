
const canvas = () => {
    const myCanvas = document.getElementById('myCanvas')

    const ctx = myCanvas.getContext("2d")


    // Membuat Garis

    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "#FBB454";
    ctx.moveTo(20, 90);
    ctx.lineTo(150, 80);
    ctx.lineTo(280, 100);
    ctx.stroke();
    
    ctx.strokeStyle = "#FBB454";

    const grd = ctx.createLinearGradient(0, 0, 0, 150);
    grd.addColorStop(0, "#FBB454");
    grd.addColorStop(1, "rgba(251, 180, 84, 0)");

    ctx.fillStyle = grd;
    ctx.moveTo(20, 90);
    ctx.lineTo(150, 80);
    ctx.lineTo(280, 100);
    ctx.lineTo(280, 130)
    ctx.lineTo(20, 130)

    ctx.fill();

        // Membuat Garis Selesai

        // Membuat lingkaran

    ctx.fillStyle = "#FBB454";
    ctx.beginPath();
    ctx.arc(20,90,3,0,2*Math.PI);
    ctx.stroke();
    ctx.fill()

    ctx.beginPath();
    ctx.arc(150,80,3,0,2*Math.PI);
    ctx.stroke();
    ctx.fill()

    ctx.beginPath();
    ctx.arc(280,100,3,0,2*Math.PI);
    ctx.stroke();
    ctx.fill()

     // Membuat lingkaran Selesai

    //  membuat teks

    ctx.beginPath()
    ctx.fillStyle = "black";
    ctx.font = "12px Poppins";
    ctx.fillText("Senin",4,145);

    ctx.fillStyle = "black";
    ctx.font = "12px Poppins";
    ctx.fillText("Selasa",130,145);

    ctx.fillStyle = "black";
    ctx.font = "12px Poppins";
    ctx.fillText("Rabu",260,145);



    ctx.beginPath()
    ctx.fillStyle = "black";
    ctx.font = "12px Poppins";
    ctx.fillText("31℃",7,80);

    ctx.fillStyle = "black";
    ctx.font = "12px Poppins";
    ctx.fillText("32℃",139,70);

    ctx.fillStyle = "black";
    ctx.font = "12px Poppins";
    ctx.fillText("29℃",269,90);
 
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

    drawImage('./assets/awan cerah.svg', 3, 40)

    drawImage('./assets/awan cerah.svg', 134, 33)

    drawImage('./assets/awan gelap.svg', 269, 50)
}
const getLocation = () => {
    navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, longitude);
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=734c808950634f7481c676bd9bb135e1`)
            .then(response => response.json())
            .then(data => {
                 let getProvinsiMentah = data.results[0].components.state
                 let getKabupatenFormBrowser = data.results[0].components.city
                 let getProvinsiFormBrowser = getProvinsiMentah.replace(/\s+/g, "");
                 const API = () => {
                    const region = document.getElementById('region')
                    const temp = document.getElementById('temp')
                
                    fetch(`https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-${getProvinsiFormBrowser}.xml`)
                        .then(response => response.text())
                        .then(data => {
                
                            const parser = new DOMParser();
                            const xml = parser.parseFromString(data, 'text/xml');
                            const items = xml.querySelector('data')
                            let dataRegion
                            // const suhu = items.childNodes[1].childNodes[3].childNodes[15].childNodes
                            // console.log(suhu);
                            

                            const kabupaten = items.childNodes[1].childNodes
                            
                            let suhu;

                            const getKabupatenFormApi = (index) => {
                                return items.childNodes[1].childNodes[index]
                            }

                           getKabupatenFormBrowser = 'Medan'
                          
                            const printDataKab = async (callback) => {
                                let dataXml
                                let dataKab
                                for(let i = 0; i <= 35; i++) {
                                    const parentNode = await getKabupatenFormApi(i);
                                    if(parentNode && parentNode.childNodes && parentNode.childNodes.length>3){
                                        dataXml = parentNode.childNodes[3].textContent.substring(5);
                                        // console.log(parentNode.childNodes[3].textContent);
                                        if(dataXml == getKabupatenFormBrowser) {
                                            dataKab = parentNode
                                        }
                                    }
                                }
                                callback(dataKab)
                            }

                            const time = (index) => {
                                return suhu[index].attributes[2].value.substring(8, 10)
                            }
                            const date = (index) => {
                                return suhu[index].attributes[2].value.substring(6, 8)
                            }
                
                            const getTimeRange = (ganjil) => {
                                return suhu[ganjil].childNodes[1].textContent
                            }
                            const getTimeNow = (h) => {
                                if (h >= 0 && h <= 6) {
                                    return '00'
                                } else if(h <= 12) {
                                    return '06'
                                } else if(h <= 18) { 
                                    return '12'
                                } else if(h >= 18) { 
                                    return '18'
                                }
                            } 
                            
                            const dateNow = new Date().getDate().toString()
                            const hours = new Date().getHours().toString()

                            printDataKab(result => {
                                dataRegion = result.attributes
                                suhu = result.childNodes[15].childNodes
                               suhu.forEach((data, index) => {
                                if(index % 2 != 0 ) {
                                    const getDate = (i,h) => {
                                        if(date(index) === i && time(index) === h) {
                                            // console.log(suhu[index]);
                                            region.innerHTML = dataRegion.description.value
                                            temp.innerHTML = getTimeRange(index)
                                        }
                                    }
                                    getDate(dateNow, getTimeNow(hours))
                                }
                            })
                            })

                            
                        });
                }
                API()
            })
     });
}
getLocation()



canvas()

