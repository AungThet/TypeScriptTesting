/// <reference path="jquery.d.ts" />
module SelectBox{

    interface OptionJson{
        key : string;
        value: string;
    }

    interface OptionElement extends OptionJson{
        name : string;
        selected_value : HTMLElement;
        select_combo : HTMLElement;
        virtualSelect : HTMLElement;
        decorator : HTMLElement;
        attributes? : JSON;
        container : HTMLElement;
    }

    interface JsonObject extends OptionElement{
        key : string;
        value : string;
        name : string;
        container : HTMLElement;
        attribute? : JSON;
        data : OptionJson[];
    }

    interface SourceTemlate {
        data : any[];
        setData(list : any[]) : void;
        getData() : any[];
        getFirstData() : any;
        getLastData() : any;
        getDataByIndex(index : number) : any;
        getDataByKey(key : string, value : any) : any;
        getDataByOption(option : HTMLElement) : any;
    }

    interface keyOperation {
        timer : any;
        key : number[];
        getKey(): number[];
        getKeyList() : string[];
        pushKey(value : number) : void;
        resetKey() : void;
        startCounter() : void; 
    }

    interface ElementTemplate {
        //optionKeyBinder: OptionElement;
        // optionList : HTMLElement[];
        // getOptionList() : HTMLElement[];
        // setOptionList(ele : HTMLElement[]) : void;
        // createOptionList(data : OptionJson[]) : void;
        // createOption(data : any): any;
        // pushOption(ele : HTMLElement) : void;
        // getOptionByIndex(index : number) : HTMLElement;
        // composeSelectBox(callback? : Function) : any;
        // getOptionByObj(obj : OptionJson) : HTMLElement;
        // setActiveOption(index : number) : HTMLElement;
        // getOptionByValue(value : string) : HTMLElement[];
        // getOptionByKey(key : string) : HTMLElement[];
        // getActiveOption() : HTMLElement;
        goNext() : HTMLElement;
        goPrevious() : HTMLElement;
        refresh(): any;
    }

    class DataSource implements SourceTemlate{
        data : any[];
        setData = (list: any[]) : void => {
            this.data = list;
        };
        getData = (): any[] => {
            return this.data;
        };
        getFirstData = () : any => {
            return this.data[0];
        };
        getLastData = () : any => {
            return this.data[this.data.length -1];
        };
        getDataByOption = (option : HTMLElement) : any => {
            return this.getDataByKey('key', $(option).attr('key'));
        };
        getDataByIndex = (index : number)  : any => {
            return this.data[index];
        };
        getDataByKey = (key : string, value : any)  : any => {
            return this.data.filter((obj : any) : boolean => { return obj[key] === value})[0];
        };

        constructor(list : any[]){
            this.setData(list);
        }
    }

    class  ElementSource implements ElementTemplate {
        dataSource : SourceTemlate;
        optionKeyBinder : OptionElement;
        optionList : HTMLElement[];
        keySet : keyOperation;
        currentActiveOption : number = 0;
        getOptionList = () : HTMLElement[] => {
            return this.optionList;
        };
        setOptionList = (eleList : HTMLElement[]) : void => { 
            this.optionList = eleList;
        };
        createOptionList = (data : OptionJson[]) : void => { 
            this.setOptionList($.map(data, (obj)  => {return this.createOption(obj);}))
        };
        createOption = (obj : any) : any => { // ( user data object ) : jquery option object
            let ele = $('<li>', {key : obj[this.optionKeyBinder.key], class : "option"}).text(obj[this.optionKeyBinder.value]);
            return ele[0];
        };
        optionClickAction = (e : JQueryEventObject) : any => {
            let index = $(e.currentTarget).index();
            let eleGotFromListByIndex = this.getOptionByIndex(index);
            let key = $(e.currentTarget).attr('key'); 
            let eleGotFromListByKey = this.getOptionByKey(key);

            if(eleGotFromListByKey.length>0){
                if(eleGotFromListByIndex == eleGotFromListByKey[0]){
                    this.setActiveOption(index);
                }
                else{
                    this.composeSelectBox();
                }
            }
            else{
                console.log("could not find by key");
            }

            return null;
        };
        pushOption= (ele : HTMLElement) : void => {
            this.optionList.push(ele);
        };
        composeSelectBox = (callback? : Function) : any => {
            let elementList  = this.getOptionList();

            let htmlSelect = document.createElement('select');
            htmlSelect.style.display = 'none';
            htmlSelect.setAttribute('name', this.optionKeyBinder.name);
            if(this.optionKeyBinder.attributes){
                $(htmlSelect).attr(this.optionKeyBinder.attributes);
            }
            this.optionKeyBinder.virtualSelect = htmlSelect;

            let select_combo = document.createElement('ul');
            let selected_value   = document.createElement('div');
            let decorator          = document.createElement('div');

            select_combo.className = 'month_combo';
            selected_value.className = 'select_month';
            decorator.className = 'arrow';

            this.optionKeyBinder.select_combo     = select_combo;
            this.optionKeyBinder.selected_value   = selected_value;
            this.optionKeyBinder.decorator          = decorator;

            this.optionKeyBinder.container.innerHTML = '';

            this.optionKeyBinder.container.appendChild(this.optionKeyBinder.selected_value);
            this.optionKeyBinder.container.appendChild(this.optionKeyBinder.decorator);

            this.optionKeyBinder.container.appendChild(this.optionKeyBinder.select_combo);
            this.optionKeyBinder.container.appendChild(this.optionKeyBinder.virtualSelect);

            this.optionKeyBinder.container.setAttribute('tabindex', '0');

        };
        bindOption = () => {
            this.optionKeyBinder.select_combo.innerText = '';
            for( let ele  of this.optionList ) {
                var el = $(ele);
                el.unbind('click', this.optionClickAction);
                el.bind('click', this.optionClickAction);
                this.optionKeyBinder.select_combo.appendChild(el.clone(true)[0]);
            }
        };
        scrollToActiveOption = () : void => {
            let select_combo = $(this.optionKeyBinder.select_combo);
            let active = select_combo.find('.active');
            if(active){
                console.log("scroll");
                var y = active.offset().top - select_combo.offset().top;
                select_combo.scrollTop($(active).position().top + select_combo.scrollTop());
            }
        };
        getOptionByIndex = (index : number) : HTMLElement => {
            return this.optionList[index];
        };
        getOptionByKey = (key : string) : HTMLElement[] => {
            return this.optionList.filter((obj : any) : any => {return obj.attributes['key'].value == key;});
        };
        getOptionByValue = (value : string) : HTMLElement[] => {
            return this.optionList.filter((obj : any) : any => {return obj.innerText == value;});
        };
        getOptionByObj = (object : any) : any => {
            return this.optionList.filter((obj : any) : any => {return object[this.optionKeyBinder.key] == $(obj).attr('key');});
        };
        setActiveOption = (index : number) : any => {
            this.currentActiveOption = (index >= 0 && index < this.optionList.length) ? index : this.currentActiveOption ;
            this.valueRefresh();
            return  this.getActiveOption();
        };
        getActiveOption = () : HTMLElement => {
            return this.getOptionByIndex(this.currentActiveOption);
        };
        goNext = () : HTMLElement => {
            this.currentActiveOption =  this.currentActiveOption+1 >= this.optionList.length ? 0 : this.currentActiveOption+1;
            this.valueRefresh();
            return this.optionList[this.currentActiveOption];
        };
        goPrevious = () : HTMLElement => {
            this.currentActiveOption =  this.currentActiveOption <= 0 ? this.optionList.length-1 : this.currentActiveOption-1;
            this.valueRefresh();
            return this.optionList[this.currentActiveOption];
        };
        refresh = () : any => {
            this.composeSelectBox();
            this.valueRefresh();
        };
        optionRefresh = () : any => {

            for(let opt of this.optionList) {
                opt.className = 'option';
            }
            this.getActiveOption().className = 'option active';

        };
        valueRefresh = () : any => {
            let active = this.getActiveOption();
            let option = $('<option>',{value : $(active).attr('key'), selected : 'selected'});
            option.text($(active).text());
            this.optionKeyBinder.virtualSelect.innerHTML = '';
            this.optionKeyBinder.virtualSelect.appendChild(option[0]);
            let value = document.createElement('div');
            value.className = 'value';
            value.innerText = active.innerText;
            this.optionKeyBinder.selected_value.innerHTML = '';
            this.optionKeyBinder.selected_value.appendChild(value);
            this.optionRefresh();
            this.bindOption();
            this.scrollToActiveOption();
        };
        containerKeyUpAction = (e : KeyboardEvent) => {      

            var keyCode = e.which;
            if (keyCode == 13) 
                    {     // enter
                        $(this.optionKeyBinder.select_combo).toggle();
                        this.scrollToActiveOption();
                    }
                    else if (keyCode == 38)
                       { // up key
                           this.goPrevious();
                       }
                       else if(keyCode == 40)
                   { // down key
                       this.goNext();
                   }
                   else
                   {    
                       if(/^[a-z0-9]+$/i.test(String.fromCharCode(keyCode))){

                           this.keySet.pushKey(e.which);
                               var result = this.searchKeyWord(this.keySet.getKeyList(), this.dataSource.data); // ( string[] , Option[])
                               if(result){
                                   this.setActiveOption(this.dataSource.data.findIndex((object) => {return object == result;}));
                               }
                               else{
                                   console.log("not change");
                               }
                           }
                       }
                   }
                   searchKeyWord = (keyList : string[], dataList : any[]) : OptionJson => {

                       for( let obj  of dataList){

                           var value = obj[this.optionKeyBinder.value].toString().split('');

                           if(value.length > 0){
                               var searchPointer = 0;
                               for(var i =0;i<value.length;i++){
                                   if(value[i].toLowerCase() === keyList[searchPointer].toLowerCase()){

                                       searchPointer++;
                                       if(searchPointer == keyList.length){
                                           return obj;
                                       }
                                   }
                               }
                           }
                       }
                   }
                   containerClickAction = (e : KeyboardEvent) => {
                       $(this.optionKeyBinder.select_combo).toggle();
                   };

                   constructor(parameter : JsonObject){
                    this.dataSource = new DataSource(parameter.data);
                    this.keySet = new keyGenerator();
                    this.optionKeyBinder = parameter; // optionElement = JsonObject;
                    this.createOptionList(parameter.data); //  createElementList(OptionJson[]);
                    this.refresh();

                    $(this.optionKeyBinder.container).keyup(this.containerKeyUpAction);
                    $(this.optionKeyBinder.container).on('click', this.containerClickAction);
                }
            }

            class keyGenerator implements keyOperation{
                timer : any;
                key : number[] = [];
                getKey = () : number[] => {
                    return this.key;
                };
                getKeyList = () : string[] => {
                    return $.map(this.key, function(value, index){
                        return String.fromCharCode(value).toLowerCase();
                    });
                };
                pushKey = (value : number) : void => {
                    this.key.push(value);
                    this.startCounter();
                };
                resetKey = () : void => {
                    this.key = [];
                };
                startCounter = () : void => {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        console.log("reset");
                        this.resetKey();
                    }, 800);
                };
            }

            export class Create{

                private elementSource : ElementTemplate;

                constructor(parameter : JsonObject){
                    this.elementSource = new ElementSource(parameter); // ElementSource(JsonObject)
                }
            }

        }