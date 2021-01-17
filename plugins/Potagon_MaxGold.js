/*:
@plugindesc
所持金の最大数変更 Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_MaxGold.js

@help
所持金をパラメータで指定した値に変更します。

@param MaxGold
@type number
@text 所持金最大数
@desc 所持金の最大数
@default 99999999
@min 0
@max 999999999999999
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
    const MaxGold = Number(params.MaxGold || 999999999999999);

/**
 * パーティを扱うクラスです。所持金やアイテムなどの情報が含まれます。
 * このクラスのインスタンスは $gameParty で参照されます。
 *
 * @class
 */

/**
 * 所持金の最大値を取得
 *
 * @returns {number} 所持金の最大値
 */
Game_Party.prototype.maxGold = function() {
    // 変更
    // return 99999999;
    return MaxGold;
};

})();
