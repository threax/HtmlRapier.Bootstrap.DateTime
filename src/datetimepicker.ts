import * as formbuilder from 'hr.formbuilder';
import * as formHelper from 'hr.formhelper';
import * as controller from 'hr.controller';

declare var $;

class DateTimeItemEditor extends formbuilder.BasicItemEditor{
    private dateName: string;

    constructor(args: formbuilder.IFormValueBuilderArgs, format?: string){
        super(args);
        $(this.element).datetimepicker({
            format: format
        });
        this.dateName = name;
    }

    public setData(data: any, serializer: formHelper.IFormSerializer) {
        super.setData(data, serializer);
        if (data[this.dateName] !== undefined) {
            $(this.element).data("DateTimePicker").date(new Date(data[this.dateName]));
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