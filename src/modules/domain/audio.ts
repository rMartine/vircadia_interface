/*
//  Copyright 2021 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

import { Domain } from "@Modules/domain/domain";
import { Client, AssignmentClientState } from "@Modules/domain/client";

import { AudioMixer, SignalEmitter } from "@vircadia/web-sdk";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Log from "@Modules/debugging/log";

// Allow 'get' lines to be compact
/* eslint-disable @typescript-eslint/brace-style */

// Function signature called for state changing
export type DomainAudioStateChangeCallback = (pD: Domain, pA: DomainAudio, pS: AssignmentClientState) => void;

export class DomainAudio extends Client {

    public onStateChange: SignalEmitter;

    #_domain: Domain;
    #_audioMixer: Nullable<AudioMixer>;

    public get Mixer(): Nullable<AudioMixer> { return this.#_audioMixer; }

    constructor(pD: Domain) {
        super();
        this.#_domain = pD;
        this.onStateChange = new SignalEmitter();
        this.#_audioMixer = new AudioMixer(pD.ContextId);
        // In 'quasar.conf.js' the worklet files from the SDK are copied into the 'js' directory
        this.#_audioMixer.audioWorkletRelativePath = "./js/";
        this.#_audioMixer.onStateChanged = this._handleOnStateChanged.bind(this);
    }

    // Return the state of the underlying assignment client
    public get clientState(): AssignmentClientState { return this.#_audioMixer?.state ?? AssignmentClientState.DISCONNECTED; }

    private _handleOnStateChanged(pNewState: AssignmentClientState): void {
        Log.debug(Log.types.AUDIO, `DomainAudio: state change = ${DomainAudio.stateToString(pNewState)}`);
        this.onStateChange.emit(this.#_domain, this, pNewState);
    }

    getDomainAudioStream(): Nullable<MediaStream> {
        return this.#_audioMixer?.audioOutput;
    }

    public get mute(): boolean {
        return this.#_audioMixer?.inputMuted ?? true;
    }

    public play(): void {
        this.#_audioMixer?.play();
    }

    public pause(): void {
        this.#_audioMixer?.pause();
    }
}
