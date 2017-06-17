import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {
    packageTypes = [
        {
            name: 'npm package',
            value: 'npm'
        },
        {
            name: 'VS Code extension',
            value: 'vs-code-extension'
        }
    ];

    constructor(private _http: Http) {

    }

    getPackageTypes(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.packageTypes);
        });
    }

    getPackageInfo(query): Observable<any> {
        return this._http.get('/api/npm-info/' + query).map((response: Response) => {
            return response.json();
        });
    }

    downloadNpmPackage(packageName: string): Observable<any> {
        return this._http.get('/api/npm/' + packageName,
                                { responseType: ResponseContentType.Blob }).map((response: Response) => {
            this.downloadFile(packageName.replace('@', '-') + '.zip', new Blob([response.blob()], { type: 'application/zip' }));
        });
    }

    downloadVsCodeExtension(publisher: string, packageName: string): Observable<any> {
        return this._http.get('/api/vsextensions/' + publisher + '/' + packageName,
                         { responseType: ResponseContentType.Blob }).map((response: Response) => {
            this.downloadFile(publisher + '.' + packageName + '.vsix', new Blob([response.blob()]));
        });
    }

    downloadFile(fileName: string, packageBlob: Blob) {
        const url = window.URL.createObjectURL(packageBlob);
        const anchor = document.createElement('a');
        anchor.download = fileName;
        anchor.href = url;
        anchor.click();
    }
}
