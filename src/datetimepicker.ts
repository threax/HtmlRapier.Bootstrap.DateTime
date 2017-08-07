import * as formbuilder from 'hr.formbuilder';
import * as formHelper from 'hr.formhelper';
import * as controller from 'hr.controller';

declare var $;

class DateTimeItemEditor extends formbuilder.BasicItemEditor{
    private dateName: string;

    constructor(name: string, buildName: string, bindings: controller.BindingCollection, generated: boolean, private element: HTMLElement){
        super(name, buildName, bindings, generated);
        $(element).datetimepicker();
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
            case 'date':
                return new DateTimeItemEditor(args.item.name, args.item.buildName, args.bindings, args.generated, args.inputElement);
        }

        return null;
    }
}

/**
 * Activate the form builder for default and horizontal forms
 */
export function activate() {
    formbuilder.registerFormValueBuilder(new Builder());
}