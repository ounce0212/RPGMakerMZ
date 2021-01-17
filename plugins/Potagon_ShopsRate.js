/*:
@plugindesc
ショップレート Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_ShopsRate.js

@help
ショップの購入時と売却時のレートを設定します。

@param BuyRate
@type number
@text 購入レート
@desc 購入倍率
@min 0
@decimals 2
@default 1.00

@param SellRate
@type number
@text 売却レート
@desc 売却倍率
@min 0
@decimals 2
@default 0.50
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.1(2021/1/17)
- リファクタ(jshint で ES6 記法に統一)

・Ver1.1.0(2021/1/11)
- ベースプラグイン更新対応
- コピーライト更新
*/

// パラメータ定義
(() => {
    'use strict';

    // パラメータ用変数
    const plugin_name = Potagon.getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    // 各パラメータ用変数
    const BuyRate  = Number(params.BuyRate || 1);
    const SellRate = Number(params.SellRate || 0.5);

/**
 * ショップ画面の処理を行うクラスです。
 *
 * @class
 */

/**
 * 買値の取得
 *
 * @returns {}
 */
Scene_Shop.prototype.buyingPrice = function() {
    return Math.floor(this._buyWindow.price(this._item) * BuyRate);
};

/**
 * 売値の取得
 *
 * @returns {}
 */
Scene_Shop.prototype.sellingPrice = function() {
    return Math.floor(this._item.price * SellRate);
};

})();
