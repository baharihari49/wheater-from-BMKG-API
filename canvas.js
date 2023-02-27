
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

module.exports = canvas