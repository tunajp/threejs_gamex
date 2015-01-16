/*
 * util.js
 * 
 * @author Mitsunori Inaba <m-inaba@phoenixdesign.jp>
 */

import * as PXConfig from './config';

/**
 * debug_board デバッグ板に文字列を出力する
 * @param {string} str
 */
export function trace_func(str)
{
  if (PXConfig._DEBUG_MODE_) {
    var d = new Date();
    var hh = pad(d.getHours());
    var mm = pad(d.getMinutes());
    var ss = pad(d.getSeconds());
    var dd = pad(d.getMilliseconds());
    var log_time = hh + ":" + mm + ":" + ss + ":" + dd;
    console.log(log_time + " " + str);
  }
}
function pad(n) { return ("0" + n).slice(-2); }

/**
 * debug_board デバッグ板に文字列を出力する
 * @param {string} str
 */
export function debug_board(str)
{
  'use strict';
  if (PXConfig._DEBUG_MODE_) {
    var d = new Date();
    var hh = d.getHours();
    var mm = d.getMinutes();
    var ss = d.getSeconds();
    var dd = d.getMilliseconds();
    var log_time = hh + ":" + mm + ":" + ss + ":" + dd;
    $('#debug_board').text(log_time + ' ' + str);
  }
}

/**
 * Hoge class
 */
export class Hoge{
  /**
   * constructor
   */
  constructor()
  {
  }
  
  /**
   * hoge method
   * @argument {int} x description
   */
  hoge(x)
  {
    console.log('Hoge::hoge');
  }
}

/**
 * ダイアログ(http://tilfin.hatenablog.com/entry/20080616/1213695611)
 *
 * message      : ダイアログのメッセージ本文
 * title        : ダイアログのタイトル
 * buttonok     : OKボタンのテキスト
 * buttoncancel : キャンセルボタンのテキスト
 * response     : コールバック関数を指定する。引数 cancel にボタン選択の結果が入る。
 *                OK ならば false キャンセルならば true となる。
 * サンプル:
 * confirmDialog('この処理を続行しますか？', '確認', 'OK', 'キャンセル', function(cancel){
 *   if (cancel) return;
 *   処理を書く
 *   });
 */
export function myDialog(message, title, buttonok, buttoncancel, response)
{
  var _dlg = $('<div>' + message + '</div>');
  var _buttons = {};
  _buttons[buttonok] = function(){
    $(this).dialog('close');
    response(false)
    $(this).dialog('destroy');
  };
  _buttons[buttoncancel] = function(){
    $(this).dialog('close');
    response(true)
    $(this).dialog('destroy');
  };
  
  _dlg.dialog({
    modal: true,
    draggable: true,
    title: title,
    //height:180,
    width: 500,
    buttons:_buttons,
    // http://stackoverflow.com/questions/8681707/jqueryui-modal-dialog-does-not-show-close-button-x
    open: function(){
        var closeBtn = $('.ui-dialog-titlebar-close');
        closeBtn.append('<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span>');
    },
    overlay: {opacity:0.3, background: "#225b7f"}
  });
  //tinymce.init({selector:'textarea'});
}

