$(document).ready(function () {
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

            let diff = Math.abs(3 - elapsed);
            let color = diff === 0 ? "green" :
                diff <= 0.2 ? "blue" :
                    diff <= 0.5 ? "goldenrod" : "red";

            $("#result").text(`You waited ${elapsed} seconds.`).css("color", color);

            updateTable();
            updateSummary();
            updateChart();
        }
    });

    $("#toggleDetails").on("click", function () {
        $("#detailsSection").toggleClass("d-none");
    });

    $("#toggleSummary").on("click", function () {
        $("#summarySection").toggleClass("d-none");
    });

    function updateTable() {
        let $body = $("#attemptTableBody").empty();
        $.each(attempts, function (i, attempt) {
            $body.append(`<tr>
                <td>${attempt.attempt}</td>
                <td>${attempt.start}</td>
                <td>${attempt.stop}</td>
                <td>${attempt.elapsed}</td>
            </tr>`);
        });
    }

    function updateSummary() {
        let times = attempts.map(a => a.elapsed);
        let min = Math.min(...times).toFixed(2);
        let max = Math.max(...times).toFixed(2);
        let avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);

        $("#totalAttempts").text(attempts.length);
        $("#minTime").text(min);
        $("#maxTime").text(max);
        $("#avgTime").text(avg);
    }

    function updateChart() {
        if (chart) chart.destroy();

        let labels = attempts.map(a => `#${a.attempt}`);
        let data = attempts.map(a => a.elapsed);
        let colors = data.map(time => {
            let diff = Math.abs(3 - time);
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
