// import Chart from 'chart.js';


export default class ChartView {
    constructor(config) {
        this.config = config;
    }

    static createList() {
        if (!w2ui['EpisodeList']) {
        }
    }

    static createDetail() {
        if (!w2ui['EpisodeList']) {
        }
    }

    static showGraph(obj, elementID) {
        let labels = [];
        let downloads = [];
        let views = [];
        for (let i in obj) {
            downloads.push(obj[i].totals.downloads || 0);
            views.push(obj[i].totals.viewCount || 0);
            labels.push(obj[i].date);
        }
        new Chart(
            document.getElementById(elementID), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Downloads",
                            data: downloads
                        },
                        {
                            label: 'Views',
                            data: views
                        }
                    ]
                }
            }
        );
    }
}
