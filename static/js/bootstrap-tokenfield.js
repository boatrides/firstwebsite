/*!
* bootstrap-tokenfield
* https://github.com/sliptree/bootstrap-tokenfield
* Copyright 2013-2014 Sliptree and other contributors; Licensed MIT
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof exports==='object'){module.exports=global.window&&global.window.$?factory(global.window.$):function(input){if(!input.$&&!input.fn){throw new Error("Tokenfield requires a window object with jQuery or a jQuery instance");}
return factory(input.$||input);};}else{factory(jQuery,window);}}(function($,window){"use strict";var Tokenfield=function(element,options){var _self=this
this.$element=$(element)
this.textDirection=this.$element.css('direction');this.options=$.extend(true,{},$.fn.tokenfield.defaults,{tokens:this.$element.val()},this.$element.data(),options)
this._delimiters=(typeof this.options.delimiter==='string')?[this.options.delimiter]:this.options.delimiter
this._triggerKeys=$.map(this._delimiters,function(delimiter){return delimiter.charCodeAt(0);});this._firstDelimiter=this._delimiters[0];var whitespace=$.inArray(' ',this._delimiters),dash=$.inArray('-',this._delimiters)
if(whitespace>=0)
this._delimiters[whitespace]='\\s'
if(dash>=0){delete this._delimiters[dash]
this._delimiters.unshift('-')}
var specialCharacters=['\\','$','[','{','^','.','|','?','*','+','(',')']
$.each(this._delimiters,function(index,character){var pos=$.inArray(character,specialCharacters)
if(pos>=0)_self._delimiters[index]='\\'+character;});var elRules=(window&&typeof window.getMatchedCSSRules==='function')?window.getMatchedCSSRules(element):null,elStyleWidth=element.style.width,elCSSWidth,elWidth=this.$element.width()
if(elRules){$.each(elRules,function(i,rule){if(rule.style.width){elCSSWidth=rule.style.width;}});}
var hidingPosition=$('body').css('direction')==='rtl'?'right':'left',originalStyles={position:this.$element.css('position')};originalStyles[hidingPosition]=this.$element.css(hidingPosition);this.$element.data('original-styles',originalStyles).data('original-tabindex',this.$element.prop('tabindex')).css('position','absolute').css(hidingPosition,'-10000px').prop('tabindex',-1)
this.$wrapper=$('<div class="tokenfield form-control" />')
if(this.$element.hasClass('input-lg'))this.$wrapper.addClass('input-lg')
if(this.$element.hasClass('input-sm'))this.$wrapper.addClass('input-sm')
if(this.textDirection==='rtl')this.$wrapper.addClass('rtl')
var id=this.$element.prop('id')||new Date().getTime()+''+Math.floor((1+Math.random())*100)
this.$input=$('<input type="'+this.options.inputType+'" class="token-input" autocomplete="off" />').appendTo(this.$wrapper).prop('placeholder',this.$element.prop('placeholder')).prop('id',id+'-tokenfield').prop('tabindex',this.$element.data('original-tabindex'))
var $label=$('label[for="'+this.$element.prop('id')+'"]')
if($label.length){$label.prop('for',this.$input.prop('id'))}
this.$copyHelper=$('<input type="text" />').css('position','absolute').css(hidingPosition,'-10000px').prop('tabindex',-1).prependTo(this.$wrapper)
if(elStyleWidth){this.$wrapper.css('width',elStyleWidth);}
else if(elCSSWidth){this.$wrapper.css('width',elCSSWidth);}
else if(this.$element.parents('.form-inline').length){this.$wrapper.width(elWidth)}
if(this.$element.prop('disabled')||this.$element.parents('fieldset[disabled]').length){this.disable();}
if(this.$element.prop('readonly')){this.readonly();}
this.$mirror=$('<span style="position:absolute; top:-999px; left:0; white-space:pre;"/>');this.$input.css('min-width',this.options.minWidth+'px')
$.each(['fontFamily','fontSize','fontWeight','fontStyle','letterSpacing','textTransform','wordSpacing','textIndent'],function(i,val){_self.$mirror[0].style[val]=_self.$input.css(val);});this.$mirror.appendTo('body')
this.$wrapper.insertBefore(this.$element)
this.$element.prependTo(this.$wrapper)
this.update()
this.setTokens(this.options.tokens,false,!this.$element.val()&&this.options.tokens)
this.listen()
if(!$.isEmptyObject(this.options.autocomplete)){var side=this.textDirection==='rtl'?'right':'left',autocompleteOptions=$.extend({minLength:this.options.showAutocompleteOnFocus?0:null,position:{my:side+" top",at:side+" bottom",of:this.$wrapper}},this.options.autocomplete)
this.$input.autocomplete(autocompleteOptions)}
if(!$.isEmptyObject(this.options.typeahead)){var typeaheadOptions=this.options.typeahead,defaults={minLength:this.options.showAutocompleteOnFocus?0:null},args=$.isArray(typeaheadOptions)?typeaheadOptions:[typeaheadOptions,typeaheadOptions]
args[0]=$.extend({},defaults,args[0])
this.$input.typeahead.apply(this.$input,args)
this.typeahead=true}}
Tokenfield.prototype={constructor:Tokenfield,createToken:function(attrs,triggerChange){var _self=this
if(typeof attrs==='string'){attrs={value:attrs,label:attrs}}else{attrs=$.extend({},attrs)}
if(typeof triggerChange==='undefined'){triggerChange=true}
attrs.value=$.trim(attrs.value.toString());attrs.label=attrs.label&&attrs.label.length?$.trim(attrs.label):attrs.value
if(!attrs.value.length||!attrs.label.length||attrs.label.length<=this.options.minLength)return
if(this.options.limit&&this.getTokens().length>=this.options.limit)return
var createEvent=$.Event('tokenfield:createtoken',{attrs:attrs})
this.$element.trigger(createEvent)
if(!createEvent.attrs||createEvent.isDefaultPrevented())return
var $token=$('<div class="token" />').append('<span class="token-label" />').append('<a href="#" class="close" tabindex="-1">&times;</a>').data('attrs',attrs)
if(this.$input.hasClass('tt-input')){this.$input.parent().before($token)}else{this.$input.before($token)}
this.$input.css('width',this.options.minWidth+'px')
var $tokenLabel=$token.find('.token-label'),$closeButton=$token.find('.close')
if(!this.maxTokenWidth){this.maxTokenWidth=this.$wrapper.width()-$closeButton.outerWidth()-
parseInt($closeButton.css('margin-left'),10)-
parseInt($closeButton.css('margin-right'),10)-
parseInt($token.css('border-left-width'),10)-
parseInt($token.css('border-right-width'),10)-
parseInt($token.css('padding-left'),10)-
parseInt($token.css('padding-right'),10)
parseInt($tokenLabel.css('border-left-width'),10)-
parseInt($tokenLabel.css('border-right-width'),10)-
parseInt($tokenLabel.css('padding-left'),10)-
parseInt($tokenLabel.css('padding-right'),10)
parseInt($tokenLabel.css('margin-left'),10)-
parseInt($tokenLabel.css('margin-right'),10)}
$tokenLabel.text(attrs.label).css('max-width',this.maxTokenWidth)
$token.on('mousedown',function(e){if(_self._disabled||_self._readonly)return false
_self.preventDeactivation=true}).on('click',function(e){if(_self._disabled||_self._readonly)return false
_self.preventDeactivation=false
if(e.ctrlKey||e.metaKey){e.preventDefault()
return _self.toggle($token)}
_self.activate($token,e.shiftKey,e.shiftKey)}).on('dblclick',function(e){if(_self._disabled||_self._readonly||!_self.options.allowEditing)return false
_self.edit($token)})
$closeButton.on('click',$.proxy(this.remove,this))
this.$element.trigger($.Event('tokenfield:createdtoken',{attrs:attrs,relatedTarget:$token.get(0)}))
if(triggerChange){this.$element.val(this.getTokensList()).trigger($.Event('change',{initiator:'tokenfield'}))}
this.update()
return this.$element.get(0)},setTokens:function(tokens,add,triggerChange){if(!tokens)return
if(!add)this.$wrapper.find('.token').remove()
if(typeof triggerChange==='undefined'){triggerChange=true}
if(typeof tokens==='string'){if(this._delimiters.length){tokens=tokens.split(new RegExp('['+this._delimiters.join('')+']'))}else{tokens=[tokens];}}
var _self=this
$.each(tokens,function(i,attrs){_self.createToken(attrs,triggerChange)})
return this.$element.get(0)},getTokenData:function($token){var data=$token.map(function(){var $token=$(this);return $token.data('attrs')}).get();if(data.length==1){data=data[0];}
return data;},getTokens:function(active){var self=this,tokens=[],activeClass=active?'.active':''
this.$wrapper.find('.token'+activeClass).each(function(){tokens.push(self.getTokenData($(this)))})
return tokens},getTokensList:function(delimiter,beautify,active){delimiter=delimiter||this._firstDelimiter
beautify=(typeof beautify!=='undefined'&&beautify!==null)?beautify:this.options.beautify
var separator=delimiter+(beautify&&delimiter!==' '?' ':'')
return $.map(this.getTokens(active),function(token){return token.value}).join(separator)},getInput:function(){return this.$input.val()},listen:function(){var _self=this
this.$element.on('change',$.proxy(this.change,this))
this.$wrapper.on('mousedown',$.proxy(this.focusInput,this))
this.$input.on('focus',$.proxy(this.focus,this)).on('blur',$.proxy(this.blur,this)).on('paste',$.proxy(this.paste,this)).on('keydown',$.proxy(this.keydown,this)).on('keypress',$.proxy(this.keypress,this)).on('keyup',$.proxy(this.keyup,this))
this.$copyHelper.on('focus',$.proxy(this.focus,this)).on('blur',$.proxy(this.blur,this)).on('keydown',$.proxy(this.keydown,this)).on('keyup',$.proxy(this.keyup,this))
this.$input.on('keypress',$.proxy(this.update,this)).on('keyup',$.proxy(this.update,this))
this.$input.on('autocompletecreate',function(){var $_menuElement=$(this).data('ui-autocomplete').menu.element
var minWidth=_self.$wrapper.outerWidth()-
parseInt($_menuElement.css('border-left-width'),10)-
parseInt($_menuElement.css('border-right-width'),10)
$_menuElement.css('min-width',minWidth+'px')}).on('autocompleteselect',function(e,ui){if(_self.createToken(ui.item)){_self.$input.val('')
if(_self.$input.data('edit')){_self.unedit(true)}}
return false}).on('typeahead:selected typeahead:autocompleted',function(e,datum,dataset){if(_self.createToken(datum)){_self.$input.typeahead('val','')
if(_self.$input.data('edit')){_self.unedit(true)}}})
$(window).on('resize',$.proxy(this.update,this))},keydown:function(e){if(!this.focused)return
var _self=this
switch(e.keyCode){case 8:if(!this.$input.is(document.activeElement))break
this.lastInputValue=this.$input.val()
break
case 37:leftRight(this.textDirection==='rtl'?'next':'prev')
break
case 38:upDown('prev')
break
case 39:leftRight(this.textDirection==='rtl'?'prev':'next')
break
case 40:upDown('next')
break
case 65:if(this.$input.val().length>0||!(e.ctrlKey||e.metaKey))break
this.activateAll()
e.preventDefault()
break
case 9:case 13:if(this.$input.data('ui-autocomplete')&&this.$input.data('ui-autocomplete').menu.element.find("li:has(a.ui-state-focus), li.ui-state-focus").length)break
if(this.$input.hasClass('tt-input')&&this.$wrapper.find('.tt-cursor').length)break
if(this.$input.hasClass('tt-input')&&this.$wrapper.find('.tt-hint').val()&&this.$wrapper.find('.tt-hint').val().length)break
if(this.$input.is(document.activeElement)&&this.$input.val().length||this.$input.data('edit')){return this.createTokensFromInput(e,this.$input.data('edit'));}
if(e.keyCode===13){if(!this.$copyHelper.is(document.activeElement)||this.$wrapper.find('.token.active').length!==1)break
if(!_self.options.allowEditing)break
this.edit(this.$wrapper.find('.token.active'))}}
function leftRight(direction){if(_self.$input.is(document.activeElement)){if(_self.$input.val().length>0)return
direction+='All'
var $token=_self.$input.hasClass('tt-input')?_self.$input.parent()[direction]('.token:first'):_self.$input[direction]('.token:first')
if(!$token.length)return
_self.preventInputFocus=true
_self.preventDeactivation=true
_self.activate($token)
e.preventDefault()}else{_self[direction](e.shiftKey)
e.preventDefault()}}
function upDown(direction){if(!e.shiftKey)return
if(_self.$input.is(document.activeElement)){if(_self.$input.val().length>0)return
var $token=_self.$input.hasClass('tt-input')?_self.$input.parent()[direction+'All']('.token:first'):_self.$input[direction+'All']('.token:first')
if(!$token.length)return
_self.activate($token)}
var opposite=direction==='prev'?'next':'prev',position=direction==='prev'?'first':'last'
_self.$firstActiveToken[opposite+'All']('.token').each(function(){_self.deactivate($(this))})
_self.activate(_self.$wrapper.find('.token:'+position),true,true)
e.preventDefault()}
this.lastKeyDown=e.keyCode},keypress:function(e){if($.inArray(e.which,this._triggerKeys)!==-1&&this.$input.is(document.activeElement)){if(this.$input.val()){this.createTokensFromInput(e)}
return false;}},keyup:function(e){this.preventInputFocus=false
if(!this.focused)return
switch(e.keyCode){case 8:if(this.$input.is(document.activeElement)){if(this.$input.val().length||this.lastInputValue.length&&this.lastKeyDown===8)break
this.preventDeactivation=true
var $prevToken=this.$input.hasClass('tt-input')?this.$input.parent().prevAll('.token:first'):this.$input.prevAll('.token:first')
if(!$prevToken.length)break
this.activate($prevToken)}else{this.remove(e)}
break
case 46:this.remove(e,'next')
break}
this.lastKeyUp=e.keyCode},focus:function(e){this.focused=true
this.$wrapper.addClass('focus')
if(this.$input.is(document.activeElement)){this.$wrapper.find('.active').removeClass('active')
this.$firstActiveToken=null
if(this.options.showAutocompleteOnFocus){this.search()}}},blur:function(e){this.focused=false
this.$wrapper.removeClass('focus')
if(!this.preventDeactivation&&!this.$element.is(document.activeElement)){this.$wrapper.find('.active').removeClass('active')
this.$firstActiveToken=null}
if(!this.preventCreateTokens&&(this.$input.data('edit')&&!this.$input.is(document.activeElement)||this.options.createTokensOnBlur)){this.createTokensFromInput(e)}
this.preventDeactivation=false
this.preventCreateTokens=false},paste:function(e){var _self=this
if(_self.options.allowPasting){setTimeout(function(){_self.createTokensFromInput(e)},1)}},change:function(e){if(e.initiator==='tokenfield')return
this.setTokens(this.$element.val())},createTokensFromInput:function(e,focus){if(this.$input.val().length<this.options.minLength)
return
var tokensBefore=this.getTokensList()
this.setTokens(this.$input.val(),true)
if(tokensBefore==this.getTokensList()&&this.$input.val().length)
return false
if(this.$input.hasClass('tt-input')){this.$input.typeahead('val','')}else{this.$input.val('')}
if(this.$input.data('edit')){this.unedit(focus)}
return false},next:function(add){if(add){var $firstActiveToken=this.$wrapper.find('.active:first'),deactivate=$firstActiveToken&&this.$firstActiveToken?$firstActiveToken.index()<this.$firstActiveToken.index():false
if(deactivate)return this.deactivate($firstActiveToken)}
var $lastActiveToken=this.$wrapper.find('.active:last'),$nextToken=$lastActiveToken.nextAll('.token:first')
if(!$nextToken.length){this.$input.focus()
return}
this.activate($nextToken,add)},prev:function(add){if(add){var $lastActiveToken=this.$wrapper.find('.active:last'),deactivate=$lastActiveToken&&this.$firstActiveToken?$lastActiveToken.index()>this.$firstActiveToken.index():false
if(deactivate)return this.deactivate($lastActiveToken)}
var $firstActiveToken=this.$wrapper.find('.active:first'),$prevToken=$firstActiveToken.prevAll('.token:first')
if(!$prevToken.length){$prevToken=this.$wrapper.find('.token:first')}
if(!$prevToken.length&&!add){this.$input.focus()
return}
this.activate($prevToken,add)},activate:function($token,add,multi,remember){if(!$token)return
if(typeof remember==='undefined')var remember=true
if(multi)var add=true
this.$copyHelper.focus()
if(!add){this.$wrapper.find('.active').removeClass('active')
if(remember){this.$firstActiveToken=$token}else{delete this.$firstActiveToken}}
if(multi&&this.$firstActiveToken){var i=this.$firstActiveToken.index()-2,a=$token.index()-2,_self=this
this.$wrapper.find('.token').slice(Math.min(i,a)+1,Math.max(i,a)).each(function(){_self.activate($(this),true)})}
$token.addClass('active')
this.$copyHelper.val(this.getTokensList(null,null,true)).select()},activateAll:function(){var _self=this
this.$wrapper.find('.token').each(function(i){_self.activate($(this),i!==0,false,false)})},deactivate:function($token){if(!$token)return
$token.removeClass('active')
this.$copyHelper.val(this.getTokensList(null,null,true)).select()},toggle:function($token){if(!$token)return
$token.toggleClass('active')
this.$copyHelper.val(this.getTokensList(null,null,true)).select()},edit:function($token){if(!$token)return
var attrs=$token.data('attrs')
var options={attrs:attrs,relatedTarget:$token.get(0)}
var editEvent=$.Event('tokenfield:edittoken',options)
this.$element.trigger(editEvent)
if(editEvent.isDefaultPrevented())return
$token.find('.token-label').text(attrs.value)
var tokenWidth=$token.outerWidth()
var $_input=this.$input.hasClass('tt-input')?this.$input.parent():this.$input
$token.replaceWith($_input)
this.preventCreateTokens=true
this.$input.val(attrs.value).select().data('edit',true).width(tokenWidth)
this.update();this.$element.trigger($.Event('tokenfield:editedtoken',options))},unedit:function(focus){var $_input=this.$input.hasClass('tt-input')?this.$input.parent():this.$input
$_input.appendTo(this.$wrapper)
this.$input.data('edit',false)
this.$mirror.text('')
this.update()
if(focus){var _self=this
setTimeout(function(){_self.$input.focus()},1)}},remove:function(e,direction){if(this.$input.is(document.activeElement)||this._disabled||this._readonly)return
var $token=(e.type==='click')?$(e.target).closest('.token'):this.$wrapper.find('.token.active')
if(e.type!=='click'){if(!direction)var direction='prev'
this[direction]()
if(direction==='prev')var firstToken=$token.first().prevAll('.token:first').length===0}
var options={attrs:this.getTokenData($token),relatedTarget:$token.get(0)},removeEvent=$.Event('tokenfield:removetoken',options)
this.$element.trigger(removeEvent);if(removeEvent.isDefaultPrevented())return
var removedEvent=$.Event('tokenfield:removedtoken',options),changeEvent=$.Event('change',{initiator:'tokenfield'})
$token.remove()
this.$element.val(this.getTokensList()).trigger(removedEvent).trigger(changeEvent)
if(!this.$wrapper.find('.token').length||e.type==='click'||firstToken)this.$input.focus()
this.$input.css('width',this.options.minWidth+'px')
this.update()
e.preventDefault()
e.stopPropagation()},update:function(e){var value=this.$input.val(),inputPaddingLeft=parseInt(this.$input.css('padding-left'),10),inputPaddingRight=parseInt(this.$input.css('padding-right'),10),inputPadding=inputPaddingLeft+inputPaddingRight
if(this.$input.data('edit')){if(!value){value=this.$input.prop("placeholder")}
if(value===this.$mirror.text())return
this.$mirror.text(value)
var mirrorWidth=this.$mirror.width()+10;if(mirrorWidth>this.$wrapper.width()){return this.$input.width(this.$wrapper.width())}
this.$input.width(mirrorWidth)}
else{var w=(this.textDirection==='rtl')?this.$input.offset().left+this.$input.outerWidth()-this.$wrapper.offset().left-parseInt(this.$wrapper.css('padding-left'),10)-inputPadding-1:this.$wrapper.offset().left+this.$wrapper.width()+parseInt(this.$wrapper.css('padding-left'),10)-this.$input.offset().left-inputPadding;isNaN(w)?this.$input.width('100%'):this.$input.width(w);}},focusInput:function(e){if($(e.target).closest('.token').length||$(e.target).closest('.token-input').length||$(e.target).closest('.tt-dropdown-menu').length)return
var _self=this
setTimeout(function(){_self.$input.focus()},0)},search:function(){if(this.$input.data('ui-autocomplete')){this.$input.autocomplete('search')}},disable:function(){this.setProperty('disabled',true);},enable:function(){this.setProperty('disabled',false);},readonly:function(){this.setProperty('readonly',true);},writeable:function(){this.setProperty('readonly',false);},setProperty:function(property,value){this['_'+property]=value;this.$input.prop(property,value);this.$element.prop(property,value);this.$wrapper[value?'addClass':'removeClass'](property);},destroy:function(){this.$element.val(this.getTokensList());this.$element.css(this.$element.data('original-styles'));this.$element.prop('tabindex',this.$element.data('original-tabindex'));var $label=$('label[for="'+this.$input.prop('id')+'"]')
if($label.length){$label.prop('for',this.$element.prop('id'))}
this.$element.insertBefore(this.$wrapper);this.$element.removeData('original-styles').removeData('original-tabindex').removeData('bs.tokenfield');this.$wrapper.remove();this.$mirror.remove();var $_element=this.$element;return $_element;}}
var old=$.fn.tokenfield
$.fn.tokenfield=function(option,param){var value,args=[]
Array.prototype.push.apply(args,arguments);var elements=this.each(function(){var $this=$(this),data=$this.data('bs.tokenfield'),options=typeof option=='object'&&option
if(typeof option==='string'&&data&&data[option]){args.shift()
value=data[option].apply(data,args)}else{if(!data&&typeof option!=='string'&&!param){$this.data('bs.tokenfield',(data=new Tokenfield(this,options)))
$this.trigger('tokenfield:initialize')}}})
return typeof value!=='undefined'?value:elements;}
$.fn.tokenfield.defaults={minWidth:60,minLength:0,allowEditing:true,allowPasting:true,limit:0,autocomplete:{},typeahead:{},showAutocompleteOnFocus:false,createTokensOnBlur:false,delimiter:',',beautify:true,inputType:'text'}
$.fn.tokenfield.Constructor=Tokenfield
$.fn.tokenfield.noConflict=function(){$.fn.tokenfield=old
return this}
return Tokenfield;}));