$(document).ready(function () {
    const TARGET_TIME = 3;

    let startTime = null;
    let attempts = [];
    let chart;

    $("#startStopBtn").on("click", function () {
        let $btn = $(this);
        if ($btn.val() === "Start") {
            startTime = Date.now();
            $btn.val("Stop");
            $("#result").text("").css("color", "");
        } else {
            let stopTime = Date.now();
            let elapsed = ((stopTime - startTime) / 1000).toFixed(2);

            attempts.push({
                attempt: attempts.length + 1,
                start: new Date(startTime).toLocaleTimeString(),
                stop: new Date(stopTime).toLocaleTimeString(),
                elapsed: parseFloat(elapsed)
            });

            $btn.val("Start");

            let diff = Math.abs(TARGET_TIME - elapsed);
            let color = diff === 0 ? "green" :
                diff <= 0.2 ? "blue" :
                    diff <= 0.5 ? "goldenrod" : "red";

            $("#result").text(`You waited ${elapsed} seconds.`).css("color", color);

            updateTable();
            updateSummary();
            updateChart();
        }
    });



    function updateChart() {
        if (chart) chart.destroy();

        let labels = attempts.map(a => `#${a.attempt}`);
        let data = attempts.map(a => a.elapsed);
        let colors = data.map(time => {
            let diff = Math.abs(TARGET_TIME - time);
            return diff === 0 ? "green" :
                diff <= 0.2 ? "blue" :
                    diff <= 0.5 ? "yellow" : "red";
        });

        let ctx = $("#attemptChart")[0].getContext("2d");
        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Elapsed Time (s)",
                    data: data,
                    backgroundColor: colors
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Seconds"
                        }
                    }
                }
            }
        });
    }
});
