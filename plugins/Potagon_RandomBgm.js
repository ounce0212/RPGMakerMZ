/*:
@plugindesc
BGMランダム再生 Ver1.1.1

@base Potagon

@target MZ
@author ポテトドラゴン
@url https://raw.githubusercontent.com/potagon/RPGMakerMZ/master/plugins/Potagon_RandomBgm.js

@help
プラグインコマンド指定したBGMの中からランダムにBGMを再生します。

@param title_bgms
@text タイトルBGM一覧
@type struct<BgmList>[]
@desc タイトルでランダム再生するBGMの一覧

@param battle_bgms
@text 戦闘BGM一覧
@type struct<BgmList>[]
@desc 戦闘中にランダム再生するBGMの一覧

@command random_bgm
@text BGMランダム再生
@desc 指定したBGMの中からランダムにBGMを再生します。

@arg bgms
@text BGM一覧
@type struct<BgmList>[]
@desc ランダムに再生するBGMの一覧
*/

/*~struct~BgmList:
@param bgm
@type file
@dir audio/bgm
@text BGM
@desc 再生するBGM

@param volume
@type number
@text 音量
@desc 再生するBGMの音量
@default 90
@max 100
@min 0

@param pitch
@type number
@text ピッチ
@desc 再生するBGMのピッチ
@default 100
@max 150
@min 50

@param pan
@type number
@text 位相
@desc 再生するBGMの位相
@default 0
@max 100
@min -100
*/

/*
Copyright (c) 2021 ポテトドラゴン
Released under the MIT License.
https://opensource.org/licenses/mit-license.php

・Ver1.1.1(2021/1/17)
- リファクタ(jshint で ES6 記法に統一)

・Ver1.1.0(2021/1/11)
- ブラウザで実行できないバグ修正(ベースプラグイン: Potagon.js の更新必須)
- ベースプラグイン更新対応
- コピーライト更新
*/

// パラメータ定義
(() => {
    'use strict';

    // パラメータ用変数
    const plugin_name = Potagon.getPluginName();
    const params      = PluginManager.parameters(plugin_name);

    /**
     * BGM の存在判定
     */
    function BgmIsExist(bgm) {
        return Potagon.isExist('audio/bgm/' + bgm + '.ogg');
    }

    function PlayRandomBgm(bgm_lists) {
        const i        = Math.randomInt(bgm_lists.length);
        const bgm_info = JSON.parse(bgm_lists[i]);
        const bgm      = String(bgm_info.bgm);
        const volume   = Number(bgm_info.volume || 90);
        const pitch    = Number(bgm_info.pitch || 100);
        const pan      = Number(bgm_info.pan || 0);

        // bgmが存在するか判定
        if (BgmIsExist(bgm)) {
            // 存在する場合、BGM判定
            AudioManager.playBgm({"name": bgm, "volume": volume, "pitch": pitch, "pan": pan});
        } else {
            // 存在しない場合、再判定
            let exist_bgm_lists = [];

            for (let i = 0; i < bgm_lists.length; i++) {
                let bgm_info = JSON.parse(bgm_lists[i]);
                let bgm      = String(bgm_info.bgm);
                if (BgmIsExist(bgm)) {
                    exist_bgm_lists.push(bgm_info);
                }
            }

            const i        = Math.randomInt(exist_bgm_lists.length);
            const bgm_info = exist_bgm_lists[i];
            const bgm      = String(bgm_info.bgm);
            const volume   = Number(bgm_info.volume || 90);
            const pitch    = Number(bgm_info.pitch || 100);
            const pan      = Number(bgm_info.pan || 0);
            AudioManager.playBgm({"name": bgm, "volume": volume, "pitch": pitch, "pan": pan});
        }
    }

    // プラグインコマンド(BGMランダム再生)
    PluginManager.registerCommand(plugin_name, "random_bgm", args => {
        const bgm_lists = JSON.parse(args.bgms);
        PlayRandomBgm(bgm_lists);
    });

/**
 * タイトル画面の処理を行うクラスです。
 *
 * @class
 */

/**
 * タイトル画面の音楽演奏
 */
const _Scene_Title_playTitleMusic = Scene_Title.prototype.playTitleMusic;
Scene_Title.prototype.playTitleMusic = function() {
    if (params.title_bgms) {
        const title_bgm_lists = JSON.parse(params.title_bgms);
        PlayRandomBgm(title_bgm_lists);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    } else {
        _Scene_Title_playTitleMusic.apply(this, arguments);
    }
};


/**
 * 戦闘の進行を管理する静的クラスです。
 *
 * @namespace
 */

/**
 * 戦闘 BGM の演奏
 */
const _BattleManager_playBattleBgm = BattleManager.playBattleBgm;
BattleManager.playBattleBgm = function() {
    if (params.battle_bgms) {
        const battle_bgm_lists = JSON.parse(params.battle_bgms);
        PlayRandomBgm(battle_bgm_lists);
        AudioManager.stopBgs();
    } else {
        _BattleManager_playBattleBgm.apply(this, arguments);
    }
};

})();
