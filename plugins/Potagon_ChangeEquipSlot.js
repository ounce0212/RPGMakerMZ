/*:
@plugindesc
装備スロット変更 Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_ChangeEquipSlot.js

@help
装備スロットを複数設定可能にします。

パラメータ(装備スロット)に装備タイプを設定することで、
装飾品を2つにするなど装備スロットを複数にすることが出来ます。
※ 導入時の設定は、装飾品が2つになる設定です。

・装備タイプの設定方法について
データベースの「タイプ」から設定できます。
以下は、設定を変更していない場合の番号です。

1. 武器
2. 盾
3. 頭
4. 身体
5. 装飾品

@param Slots
@type number[]
@text 装備スロット
@desc 装備スロット(装備タイプ)の番号を指定
装備タイプがデフォルトの場合は、1: 武器 5: 装飾品
@default ["1", "2", "3", "4", "5", "5"]
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.1(2021/1/17)
- ヘルプ修正
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
    let Slots = Potagon.numberArray(params.Slots);

/**
 * アクターを扱うクラスです。
 * このクラスは Game_Actors クラス（$gameActors）の内部で使用され、
 * Game_Party クラス（$gameParty）からも参照されます。
 *
 * @class
 */

/**
 * 装備スロットの配列を取得
 *
 * @returns {array} 装備スロットの配列
 */
Game_Actor.prototype.equipSlots = function() {
    if (Slots.length >= 2 && this.isDualWield()) {
        Slots[1] = 1;
    }
    return Slots;
};

})();
