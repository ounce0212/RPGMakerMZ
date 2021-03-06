/*:
@plugindesc
アイテムの最大所持数変更 Ver1.1.2

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_MaxItem.js

@help
アイテムの最大所持数を変更します。

最大所持数の桁が増えると、アイテムの最大文字数が少なくなるので、
パラメータ "アイテム列" で列を1列にするか、最大所持数を減らしてください。
4桁(9999)のときは、アイテムの最大文字数は全角で10文字です。

アイテムのメモ欄に <最大所持数:9999> のように
指定すると個別に最大所持数を設定できます。

@param MaxItem
@type number
@text アイテム最大所持数
@desc アイテムの最大所持数
@default 9999
@min 0

@param MaxCol
@type number
@text アイテム列
@desc アイテムの列
@default 2
@min 1
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.2(2021/2/14)
- ヘルプ修正

・Ver1.1.1(2021/1/17)
- リファクタ(jshint で ES6 記法に統一)
*/

// パラメータ定義
(() => {
    'use strict';

    // パラメータ用変数
    const plugin_name = Potagon.getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const MaxItem = Number(params.MaxItem || 9999);
    const MaxCol  = Number(params.MaxCol  || 2);

/**
 *
 *
 * @param {} item -
 * @returns {number} アイテムの最大所持数
 */
function maxItem(item) {
    if (!item) {
        return MaxItem;
    }
    const max_item_str = item.meta['最大所持数'];
    let max_item = max_item_str ? Number(max_item_str) : MaxItem;
    return max_item;
}

/**
 * パーティを扱うクラスです。所持金やアイテムなどの情報が含まれます。
 * このクラスのインスタンスは $gameParty で参照されます。
 *
 * @class
 */

/**
 * アイテムの最大所持数取得
 *
 * @returns {number} アイテムの最大所持数
 */
Game_Party.prototype.maxItems = function(item) {
    return maxItem(item);
};


/**
 * アイテム画面で、所持アイテムの一覧を表示するウィンドウです。
 *
 * @class
 */

/**
 * 桁数の取得
 *
 * @returns {number} 桁数
 */
Window_ItemList.prototype.maxCols = function() {
    return MaxCol;
};

/**
 * アイテムの個数を描画
 *
 * @param {} item -
 * @param {} x -
 * @param {} y -
 * @param {} width -
 */
Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(":", x, y, width - this.textWidth(maxItem(item)), "right");
        this.drawText($gameParty.numItems(item), x, y, width, "right");
    }
};

/**
 * 個数表示の最大桁数を取得
 *
 * @returns {number} 個数表示の最大桁数
 */
Window_ShopNumber.prototype.maxDigits = function() {
    return String(maxItem(this._item)).length;
};

})();
