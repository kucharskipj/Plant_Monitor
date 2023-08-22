firebase.auth().onAuthStateChanged((user) => {
// only authenticated user can query Firestore
if (user) {
const plant_names = [];
const data = [];

// connection to db
const db = firebase.firestore();
// collection ref
const colRef = db.collection("Data");
// get data - last 480 data points
colRef.orderBy("timestamp", "desc").limit(480).get()
      .then((snapshot) => {
        snapshot.docs.forEach(doc => {
          let items = doc.data();
          plant_names.push(items['plant_name']);
          // prepare data for ploting
          data.push({x: items['timestamp']['seconds']*1000, y:items['soil_moisture'], plant_name:items['plant_name']});
      });
      }).then(() => {
        // find unique plants to create one chart per plant
        const plants = new Set(plant_names);
        document.getElementById('myChart').remove();

        // for each unique plant create one chart
        plants.forEach(plant => {
          
          g = document.createElement('div');
          h = document.createElement('canvas');
          g.appendChild(h);
          document.getElementById('charts').appendChild(g);
          g.setAttribute("class", "row");
          h.setAttribute("id", plant+"Chart");
          h.setAttribute("style", "margin-bottom:30px;")

        let ctx = document.getElementById(plant+"Chart");
        new Chart(ctx, {
          type: "line",
          data: {
            datasets: [{borderColor: "rgba(90, 171, 97, 0.8)", label: plant, data: data.filter((data_point => {return data_point['plant_name'] === plant;}))}]
          },
          options:{
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: plant,
                font:{
                  size: 20
                }
              }
            },
            scales:{
              x:{
                type: 'time',
                time: {
                  displayFormats: {
                    hour: 'dd-MM-yyyy',
                    day: 'dd-MM-yyyy',
                    week: 'dd-MM-yyyy',
                    month: 'dd-MM-yyyy',
                    quarter: 'dd-MM-yyyy',
                    year: 'dd-MM-yyyy'
                  },
                  unitStepSize: 1,
                  minUnit: 'day',
                  unit: 'day'
                },
                  ticks: {
                      autoSkip: true,
                      maxRotation: 90,
                      minRotation: 0
                  }
              }
            }
          }
        });
      });
      });

    }
    else {
      // if user is unauthorized to query Firebase print the message in console
      console.log('User unsigned!')
    }
    });