import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { RuntimeConfigService } from './runtime-config.service';

describe('RuntimeConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses the address of the configuration file', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ apiBaseUrl: 'https://api.example.test' }),
      }),
    );

    const service = TestBed.inject(RuntimeConfigService);
    await service.load();

    expect(service.apiBaseUrl()).toBe('https://api.example.test');
  });

  it('keeps the compiled address when the file is not there', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));

    const service = TestBed.inject(RuntimeConfigService);
    await service.load();

    expect(service.apiBaseUrl()).toBe(environment.apiBaseUrl);
  });

  it('keeps the compiled address when the file is broken', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('the network is gone')));

    const service = TestBed.inject(RuntimeConfigService);
    await service.load();

    expect(service.apiBaseUrl()).toBe(environment.apiBaseUrl);
  });

  it('keeps the compiled address when the file carries no address', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ apiBaseUrl: '' }) }),
    );

    const service = TestBed.inject(RuntimeConfigService);
    await service.load();

    expect(service.apiBaseUrl()).toBe(environment.apiBaseUrl);
  });
});
