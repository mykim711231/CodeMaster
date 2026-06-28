import type { Level, Pack, Snippet } from '../types';
import { javaCore } from './_staging/L1-jc';
import { springCore } from './_staging/L2-sc';
import { springMvc } from './_staging/L3-mvc';
import { springDb } from './_staging/L4-db';
import { concurrency } from './_staging/L5-conc';
import { network } from './_staging/L6-net';
import { gateway } from './_staging/L7-gw';
import { messaging } from './_staging/L8-msg';
import { batch } from './_staging/L9-batch';
import { security } from './_staging/L10-sec';
import { cache } from './_staging/L11-cache';
import { monitoring } from './_staging/L12-mon';
import { testing } from './_staging/L13-test';
import { architecture } from './_staging/L14-arch';
import { designPattern } from './_staging/L15-dp';
import { devops } from './_staging/L16-devops';
import { observability } from './_staging/L17-obs';
import { dataAdvanced } from './_staging/L18-data';
import { resilience } from './_staging/L19-resil';
import { reactive } from './_staging/L20-rx';

// Spring Boot 3.4.x · Java 21 (LTS) - PRD §7 / §8.1
// 짧은 실무 패턴 + 입문자용 설명(개념·코드 뜯어보기·왜·주의).
// All level arrays imported from _staging/ files.

const L = (no: number, name: string, snippets: Snippet[] = []): Level => ({ no, name, snippets });

export const springBootPack: Pack = {
  id: 'spring-boot',
  name: 'Spring Boot',
  lang: 'java',
  levels: [
    L(1, 'Java Core', javaCore),
    L(2, 'Spring Core', springCore),
    L(3, 'Spring Boot MVC', springMvc),
    L(4, 'Database - JPA/MyBatis', springDb),
    L(5, 'Concurrency', concurrency),
    L(6, 'Network', network),
    L(7, 'Gateway', gateway),
    L(8, 'Messaging', messaging),
    L(9, 'Batch', batch),
    L(10, 'Security', security),
    L(11, 'Cache', cache),
    L(12, 'Monitoring', monitoring),
    L(13, 'Testing', testing),
    L(14, 'Architecture', architecture),
    L(15, 'Design Pattern', designPattern),
    L(16, 'Build & DevOps', devops),
    L(17, 'Observability', observability),
    L(18, 'Data 심화', dataAdvanced),
    L(19, 'Resilience & Cloud-Native', resilience),
    L(20, 'Reactive', reactive),
  ],
};
