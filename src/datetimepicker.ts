import * as formbuilder from 'htmlrapier/src/formbuilder';

declare var moment;

type GetFullTimeStringCb = (d: string) => string;
class DateTimeItemEditor extends formbuilder.BasicItemEditor{
    private displayTimezone: string;
    private dataTimezone: string;

    constructor(args: formbuilder.IFormValueBuilderArgs, private getFullTimeString: GetFullTimeStringCb){
        super(args);

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
        //Check the superclass to see if it detects data, if it does format and return it otherwise just return undefined. The underlying date-time control
        //does not do a good job of detecting null.
        if (!super.getData()) {
            return undefined;
        }

        var strValue = this.getFullTimeString((this.element as HTMLInputElement).value);
        var value = moment(strValue);
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

            (this.element as HTMLInputElement).value = itemData.format('YYYY-MM-DD[T]HH:mm:ss');
        }
        else {
            (this.element as HTMLInputElement).value = null;
        }
    }
}

class Builder implements formbuilder.IFormValueBuilder {
    public create(args: formbuilder.IFormValueBuilderArgs) : formbuilder.IFormValue | null{
        switch(args.item.buildType){
            case 'date-time':
                return new DateTimeItemEditor(args, s => s);
            case 'date':
                return new DateTimeItemEditor(args, s => s + "T00:00:00");
            case 'time':
                return new DateTimeItemEditor(args, s => "0001-01-01T" + s);
        }

        return null;
    }
}

formbuilder.registerFormValueBuilder(new Builder());

export function setup() {
    return true; //Doesn't do anything, but makes module work
}