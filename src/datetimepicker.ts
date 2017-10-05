import * as formbuilder from 'hr.formbuilder';
import * as formHelper from 'hr.formhelper';
import * as controller from 'hr.controller';

declare var $;

class DateTimeItemEditor extends formbuilder.BasicItemEditor{
    constructor(args: formbuilder.IFormValueBuilderArgs, format?: string){
        super(args);
        $(this.element).datetimepicker({
            format: format
        });
    }

    public doSetValue(itemData: any) {
        if (itemData !== undefined && itemData !== null) {
            $(this.element).data("DateTimePicker").date(new Date(itemData));
        }
        else {
            (<HTMLFormElement>this.element).value = "";
        }
    }
}

class Builder implements formbuilder.IFormValueBuilder {
    public create(args: formbuilder.IFormValueBuilderArgs) : formbuilder.IFormValue | null{
        switch(args.item.buildType){
            case 'date-time':
                return new DateTimeItemEditor(args);
            case 'date':
                return new DateTimeItemEditor(args, "MM/DD/YYYY");
        }

        return null;
    }
}

export function activate() {
    formbuilder.registerFormValueBuilder(new Builder());
}