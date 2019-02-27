import * as formbuilder from 'hr.formbuilder';
import * as formHelper from 'hr.formhelper';
import * as controller from 'hr.controller';

declare var $;

class DateTimeItemEditor extends formbuilder.BasicItemEditor{
    private displayTimezone: string;
    private dataTimezone: string;
    private dateTimePicker;

    constructor(args: formbuilder.IFormValueBuilderArgs, format?: string){
        super(args);
        $(this.element).datetimepicker({
            format: format
        });
        this.dateTimePicker = $(this.element).data("DateTimePicker");

        var xUi = <any>args.item.xUi;
        if (xUi && xUi.dataTimezone) {
            if (moment.tz) {
                //Schema provided a display timezone
                if (xUi.displayTimezone) {
                    this.dataTimezone = xUi.dataTimezone;
                    this.displayTimezone = xUi.displayTimezone;
                }
                //Schema did not provide a timezone, guess the browser's time.
                else {
                    this.displayTimezone = moment.tz.guess();
                    if (this.displayTimezone) {
                        this.dataTimezone = xUi.dataTimezone;
                    }
                    else {
                        console.warn("Cannot determine browser's timezone. Times will not be localized.");
                    }
                }
            }
            else {
                console.warn("The date element specified a timezone, but moment-timezone.js is not loaded. Times will not be localized.");
            }
        }
    }

    public getData(): any {
        var value = this.dateTimePicker.date();
        if (this.dataTimezone) {
            moment.tz.setDefault(this.displayTimezone);
            value = moment(value.format('YYYY-MM-DD[T]HH:mm:ss')); //Reset any timezones, we want the displayTimezone to be the one set to whatever time we have.
            moment.tz.setDefault();
            //If the data came in with a timezone it has one going out
            value = value.tz(this.dataTimezone);
        }
        return value.format('YYYY-MM-DD[T]HH:mm:ss');
    }

    public doSetValue(itemData: any) {
        if (itemData !== undefined && itemData !== null) {
            if (this.dataTimezone) {
                moment.tz.setDefault(this.dataTimezone);
                itemData = moment(itemData).tz(this.displayTimezone);
                moment.tz.setDefault();
            }
            else {
                itemData = moment(itemData);
            }

            this.dateTimePicker.date(itemData);
        }
        else {
            this.dateTimePicker.date(null);
        }
    }
}

class Builder implements formbuilder.IFormValueBuilder {
    public create(args: formbuilder.IFormValueBuilderArgs) : formbuilder.IFormValue | null{
        switch(args.item.buildType){
            case 'date-time':
                return new DateTimeItemEditor(args, "MM/DD/YYYY hh:mm:ss A");
            case 'date':
                return new DateTimeItemEditor(args, "MM/DD/YYYY");
        }

        return null;
    }
}

export function activate() {
    formbuilder.registerFormValueBuilder(new Builder());
}