export default class CalendarView {
    constructor(items, config) {
        this.config = config;
        this.config.view = config.view || 'dayGridMonth';
        this.items = items;
        this.target = document.getElementById(this.config.target);
        this.config.events = items;
        this.calendar = new EventCalendar(document.getElementById(this.config.target), this.config);
        if(config.onDrop) {
            this.calendar.setOption('eventDrop', config.onDrop);
        }
        if(config.onClick) {
            this.calendar.setOption('eventClick', config.onClick);
        }
        this.calendar.setOption('eventMouseEnter', (info) => {
            if(!this.tooltip) {
                this.tooltip = document.createElement('div');
                this.tooltip.id = 'calendartooltip';
                this.tooltip.style.width = '100px';
                this.tooltip.style.color = "black";
            }
            this.tooltip.textContent = info.event.title;
            this.tooltip.style.background = info.event.backgroundColor;
            this.tooltip.style.top = info.jsEvent.pageY + 'px';
            this.tooltip.style.left = info.jsEvent.pageX + 'px';
            this.tooltip.style.display = 'block';
            info.el.parentElement.appendChild(this.tooltip);
        });
        this.calendar.setOption('eventMouseLeave', (info) => {
            if(this.tooltip) {
               this.tooltip.style.display = 'none';
            }
        });
    }

    static openDialog(items,previousWindow, config) {
        w2popup.open({
            height: config.height || 1600,
            width: config.width || 1600,
            title: `Calendar`,
            body: '<div id="popupContent" style="width: 100%; height: 100%;"><div id="myCalendar"></div><div><button id="closeCalendar" class="btn dialogButton">Close</button></div></div>',
            showMax: true,
            onToggle: function (event) {
                $(w2ui.popupContent.box).hide();
                event.onComplete = function () {
                    $(w2ui.popupContent.box).show();
                    w2ui.popupContent.resize();
                }
            },
            onOpen: function (event) {
                event.onComplete = function () {
                    // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler,
                    // which would make this code execute too early and hence not deliver.
                    config.target = 'myCalendar';
                    let calendar = new CalendarView(items, config);
                }
            }
        });
        $("#closeCalendar").click(function() {
            $('#popupContent').w2render(w2ui[previousWindow]);
        })
    }
}
