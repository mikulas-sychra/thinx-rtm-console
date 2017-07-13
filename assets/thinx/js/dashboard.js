var Dashboard = function() {

    var dashboardMainChart = null;

    return {

        initMorisCharts: function() {
            if (Morris.EventEmitter && $('#device_statistics').size() > 0) {
                // Use Morris.Area instead of Morris.Line
                dashboardMainChart = Morris.Area({
                    element: 'device_statistics',
                    padding: 0,
                    behaveLikeLine: false,
                    gridEnabled: false,
                    gridLineColor: false,
                    axes: false,
                    fillOpacity: 1,
                    data: [{
                        period: '2011 Q1',
                        sales: 1400,
                        profit: 400
                    }, {
                        period: '2011 Q2',
                        sales: 1100,
                        profit: 600
                    }, {
                        period: '2011 Q3',
                        sales: 1600,
                        profit: 500
                    }, {
                        period: '2011 Q4',
                        sales: 1200,
                        profit: 400
                    }, {
                        period: '2012 Q1',
                        sales: 1550,
                        profit: 800
                    }],
                    lineColors: ['#399a8c', '#92e9dc'],
                    xkey: 'period',
                    ykeys: ['sales', 'profit'],
                    labels: ['This Week', 'last Week'],
                    pointSize: 0,
                    lineWidth: 0,
                    hideHover: 'auto',
                    resize: true
                });

            }
        },

        init: function() {
            this.initMorisCharts();
        }
    };

}();

if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        Dashboard.init(); // init metronic core componets
    });
}
